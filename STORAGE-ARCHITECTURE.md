# 🎯 Storage Architecture: Future-Proof Media Storage

## ✅ **RECOMMENDED SOLUTION: Hybrid Approach**

**Your concern about storing images/audio in the database is 100% correct!** Here's the optimal, scalable solution:

### **Vercel Blob** → Store actual files (images, audio, videos)
### **PostgreSQL** → Store metadata only (file references, URLs, metadata)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Uploads File                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  API Route: /api/upload                                 │
│  - Validates file (size, type, security)                 │
│  - Uploads to Vercel Blob                                │
│  - Gets back: blob URL                                  │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│  Vercel Blob     │   │  PostgreSQL          │
│  (File Storage)  │   │  (Metadata)          │
│                  │   │                      │
│  ✅ Image file   │   │  ✅ storageKey        │
│  ✅ Audio file   │   │  ✅ filename          │
│  ✅ Video file   │   │  ✅ mimeType          │
│  ✅ Documents    │   │  ✅ sizeBytes         │
│                  │   │  ✅ userId            │
│  Scales to PB    │   │  ✅ createdAt         │
│  CDN-enabled     │   │  ✅ Additional fields │
└──────────────────┘   └──────────────────────┘
```

---

## ✅ Why This Approach is Best

### **1. Scalability**
- **Vercel Blob**: Scales to petabytes, no database bloat
- **PostgreSQL**: Stays lean, fast queries on metadata
- **CDN**: Automatic global distribution via Vercel Edge Network

### **2. Performance**
- **Database**: Fast queries on small metadata records
- **Blob Storage**: Optimized for large file retrieval
- **No Database Bloat**: Database size stays manageable

### **3. Cost Efficiency**
- **Blob Storage**: ~$0.15/GB/month (much cheaper than database storage)
- **Database**: Only stores references (KB, not GB)
- **Bandwidth**: CDN reduces origin load

### **4. Future-Proof**
- **Industry Standard**: Same pattern used by AWS S3, Google Cloud Storage, etc.
- **Easy Migration**: Can switch providers if needed (S3, Cloudflare R2, etc.)
- **Separation of Concerns**: Files separate from application data

### **5. Your Prisma Schema Already Supports This!**

Your `Attachment` model is **perfectly designed** for this:

```prisma
model Attachment {
  id         String   @id @default(cuid())
  projectId  String
  filename   String
  mimeType   String
  sizeBytes  Int
  storageKey String   // ✅ This stores the Blob URL/reference!
  createdAt  DateTime @default(now())
  // ... relations
}
```

**This is exactly the right pattern!** ✅

---

## 📋 Implementation Guide

### Step 1: Upload File to Vercel Blob

```typescript
// src/app/api/upload/route.ts
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public', // or 'private' for authenticated access
    addRandomSuffix: true, // Prevents filename conflicts
  });

  // Store metadata in PostgreSQL
  const attachment = await prisma.attachment.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      storageKey: blob.url, // ✅ Store Blob URL, not the file!
      projectId: 'your-project-id', // or get from request
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    id: attachment.id,
    url: blob.url, // Use this URL to display/download
    filename: attachment.filename,
  });
}
```

### Step 2: Retrieve File Metadata

```typescript
// src/app/api/attachments/[id]/route.ts
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: params.id },
  });

  if (!attachment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Return metadata + Blob URL
  return NextResponse.json({
    id: attachment.id,
    url: attachment.storageKey, // Blob URL
    filename: attachment.filename,
    mimeType: attachment.mimeType,
    sizeBytes: attachment.sizeBytes,
    createdAt: attachment.createdAt,
  });
}
```

### Step 3: Display Files in Frontend

```typescript
// src/components/MediaDisplay.tsx
export function MediaDisplay({ attachmentId }: { attachmentId: string }) {
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    fetch(`/api/attachments/${attachmentId}`)
      .then(res => res.json())
      .then(data => setAttachment(data));
  }, [attachmentId]);

  if (!attachment) return <div>Loading...</div>;

  const isImage = attachment.mimeType?.startsWith('image/');
  const isAudio = attachment.mimeType?.startsWith('audio/');
  const isVideo = attachment.mimeType?.startsWith('video/');

  return (
    <div>
      {isImage && (
        <img 
          src={attachment.url} 
          alt={attachment.filename}
          className="max-w-full"
        />
      )}
      {isAudio && (
        <audio controls src={attachment.url}>
          Your browser does not support audio.
        </audio>
      )}
      {isVideo && (
        <video controls src={attachment.url}>
          Your browser does not support video.
        </video>
      )}
      <a href={attachment.url} download>
        Download {attachment.filename}
      </a>
    </div>
  );
}
```

---

## 🎯 Database Schema Recommendations

### Current Schema (Already Good!)

Your `Attachment` model is perfect. Consider adding:

```prisma
model Attachment {
  id         String   @id @default(cuid())
  projectId  String
  runId      String?
  filename   String
  mimeType   String
  sizeBytes  Int
  storageKey String   // ✅ Blob URL or path
  createdAt  DateTime @default(now())
  
  // Optional: Add these for better organization
  userId     String?  // Who uploaded it
  category   String?  // "image", "audio", "document", etc.
  tags       String[] // For search/filtering
  
  // Relations
  project Project @relation(fields: [projectId], references: [id])
  run     Run?    @relation(fields: [runId], references: [id])
  
  @@index([projectId, createdAt])
  @@index([userId, createdAt])
  @@index([category])
}
```

### For Audio-Specific Metadata

If you need audio-specific metadata (duration, waveform, etc.):

```prisma
model AudioMetadata {
  id           String   @id @default(cuid())
  attachmentId String   @unique
  duration     Float?   // seconds
  sampleRate   Int?     // Hz
  bitrate      Int?     // kbps
  channels     Int?     // mono=1, stereo=2
  waveform     Json?    // Waveform data for visualization
  
  attachment   Attachment @relation(fields: [attachmentId], references: [id])
}
```

### For Image-Specific Metadata

```prisma
model ImageMetadata {
  id           String   @id @default(cuid())
  attachmentId String   @unique
  width        Int?
  height        Int?
  format        String?  // "jpeg", "png", "webp"
  colorSpace    String?  // "RGB", "CMYK"
  exif          Json?    // EXIF data
  
  attachment   Attachment @relation(fields: [attachmentId], references: [id])
}
```

---

## 🔒 Security Best Practices

### 1. File Validation

```typescript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/webm'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File, allowedTypes: string[]) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  // Additional: Check file signature (magic bytes)
}
```

### 2. Access Control

```typescript
// Only allow file access to authorized users
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const attachment = await prisma.attachment.findUnique({
    where: { id: params.id },
    include: { project: true },
  });

  // Check if user has access to the project
  if (attachment.project.userId !== session?.user?.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(attachment);
}
```

### 3. Private vs Public Files

```typescript
// Public files (e.g., user avatars)
const blob = await put(file.name, file, {
  access: 'public',
});

// Private files (e.g., user documents)
const blob = await put(file.name, file, {
  access: 'private', // Requires signed URL for access
});

// Generate signed URL for private files
import { getSignedUrl } from '@vercel/blob';
const signedUrl = await getSignedUrl(blob.url, { expiresIn: 3600 }); // 1 hour
```

---

## 📊 Comparison: Database vs Blob Storage

| Aspect | Database Storage | Blob Storage (Recommended) |
|--------|------------------|---------------------------|
| **File Size Limit** | Limited (MB range) | Unlimited (TB+) |
| **Database Size** | Grows with files | Stays small |
| **Query Performance** | Slows with large files | Fast (metadata only) |
| **Backup/Restore** | Slow, large backups | Fast, separate backups |
| **CDN Integration** | Not available | Built-in (Vercel Edge) |
| **Cost** | Expensive per GB | Cheap per GB |
| **Scalability** | Limited | Virtually unlimited |
| **Best For** | Small metadata | Large media files |

---

## 🚀 Migration Path

If you currently have files stored elsewhere:

1. **Keep existing files** where they are (don't delete yet)
2. **Upload new files** to Vercel Blob
3. **Migrate old files** gradually:
   ```typescript
   // Migration script
   for (const oldFile of oldFiles) {
     const file = await downloadFromOldStorage(oldFile.path);
     const blob = await put(oldFile.filename, file);
     await prisma.attachment.update({
       where: { id: oldFile.id },
       data: { storageKey: blob.url },
     });
   }
   ```

---

## ✅ Your Current Setup

**Good news:** You already have:
- ✅ Vercel Blob configured (`BLOB_READ_WRITE_TOKEN`)
- ✅ Prisma schema with `Attachment` model
- ✅ `storageKey` field ready for Blob URLs

**What you need:**
1. ✅ Set up PostgreSQL (from previous checklist)
2. ✅ Update upload endpoints to use Vercel Blob
3. ✅ Store Blob URLs in `storageKey` field

---

## 📚 Resources

- **Vercel Blob Docs**: https://vercel.com/docs/storage/vercel-blob
- **@vercel/blob Package**: https://www.npmjs.com/package/@vercel/blob
- **Prisma File Storage Guide**: https://www.prisma.io/docs/guides/storage

---

## 🎯 Summary

**DO:**
- ✅ Store files in **Vercel Blob**
- ✅ Store metadata in **PostgreSQL**
- ✅ Use `storageKey` field for Blob URLs
- ✅ Validate files before upload
- ✅ Implement access control

**DON'T:**
- ❌ Store large files in PostgreSQL
- ❌ Store binary data in database BLOB columns
- ❌ Store files in filesystem (won't work on Vercel)
- ❌ Store files in JSON files (won't scale)

**Your architecture is already on the right track!** Just need to implement the upload endpoints using Vercel Blob. 🚀
