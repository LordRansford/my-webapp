import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getSupportTicketAdminSafe } from "@/lib/admin/supportStore";

/**
 * Secure attachment download route.
 *
 * Safety posture (foundation-only):
 * - Supports screenshots only (enforced at upload time in future prompt).
 * - No inline rendering here. Return as attachment when storage is wired.
 * - For now we only store metadata and return a clear error if no storage key exists.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string; attachmentId: string }> }) {
  const auth = await requireAdminJson("VIEW_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-support-attachment", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id, attachmentId } = await ctx.params;
  const ticket = await getSupportTicketAdminSafe(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const att = ticket.attachments.find((a) => a.id === attachmentId);
  if (!att) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!att.storageKey) {
    return NextResponse.json({ error: "Attachment storage is not configured for this environment." }, { status: 501 });
  }

  // Download from object storage (Vercel Blob or S3)
  try {
    // Try Vercel Blob first
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { get } = require('@vercel/blob');
      const blob = await get(att.storageKey, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': att.mimeType,
          'Content-Disposition': `attachment; filename="${att.fileName}"`,
        },
      });
    }
    
    // Try AWS S3 as fallback
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      try {
        // Use Function constructor to create a dynamic require that bundler can't analyze
        const requireS3 = new Function('moduleName', 'return require(moduleName)');
        const s3Module = requireS3('@aws-sdk/client-s3');
        const { S3Client, GetObjectCommand } = s3Module;
        const s3Client = new S3Client({
          region: process.env.AWS_REGION || 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
        
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: att.storageKey,
        });
        
        const response = await s3Client.send(command);
        const body = await response.Body.transformToByteArray();
        
        return new NextResponse(body, {
          headers: {
            'Content-Type': att.mimeType,
            'Content-Disposition': `attachment; filename="${att.fileName}"`,
          },
        });
      } catch (s3Error: any) {
        // AWS SDK not installed or other error - fall through
        if (s3Error?.code !== 'MODULE_NOT_FOUND') {
          console.error('AWS S3 download failed:', s3Error);
        }
        // Fall through to error response
      }
    }
    
    // No storage configured
    return NextResponse.json(
      { error: "Attachment storage is not configured. Please set up Vercel Blob or AWS S3." },
      { status: 501 }
    );
  } catch (error) {
    console.error('Failed to download attachment:', error);
    return NextResponse.json(
      { error: "Failed to download attachment" },
      { status: 500 }
    );
  }
}


