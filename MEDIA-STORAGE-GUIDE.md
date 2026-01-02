# 🎯 Media Storage Guide: Images & Audio

## ✅ **You're Already Using the Right Approach!**

**Good news:** Your codebase already implements the best-practice storage architecture:
- ✅ **Vercel Blob** for file storage (`src/lib/ai-studio/storage.ts`)
- ✅ **PostgreSQL** for metadata (Prisma `Attachment` model)
- ✅ **Security** with authentication and validation

**This is exactly the right pattern!** Now let's extend it for images and audio.

---

## 🏗️ Current Architecture (Already Working)

Your AI Studio already uses this pattern:

```
File Upload → Vercel Blob → Store URL in Database
```

**Example from your code:**
```typescript
// src/app/api/ai-studio/datasets/upload/route.ts
const uploadResult = await uploadFile(sanitizedFile, auth.user!.id, {
  type: "datasets",
});

// Store in database
const dataset = await createDataset({
  filePath: uploadResult.pathname, // ✅ Blob pathname
  // ... other metadata
});
```

---

## 📋 Extending for Images & Audio

### Step 1: Update Storage Config

```typescript
// src/lib/ai-studio/storage.ts (extend existing)

export const STORAGE_CONFIG: StorageConfig = {
  provider: "vercel-blob",
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: [
    // Existing
    ".csv", ".json", ".jsonl", ".parquet", ".hdf5",
    // Add media types
    ".jpg", ".jpeg", ".png", ".webp", ".gif", // Images
    ".mp3", ".wav", ".ogg", ".webm", ".m4a", // Audio
    ".mp4", ".webm", ".mov", // Video (optional)
  ],
};
```

### Step 2: Create Media Upload Endpoint

```typescript
// src/app/api/media/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/ai-studio/auth";
import { uploadFile } from "@/lib/ai-studio/storage";
import { prisma } from "@/lib/db/prisma";
import { validateUpload } from "@/utils/validateUpload";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_AUDIO_TYPES = [".mp3", ".wav", ".ogg", ".webm", ".m4a"];

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response!;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine file type and limits
    const isImage = ALLOWED_IMAGE_TYPES.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    const isAudio = ALLOWED_AUDIO_TYPES.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: "File must be an image or audio file" },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
    const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;

    // Validate
    const { safeFiles, errors } = validateUpload([file], {
      maxBytes: maxSize,
      allowedExtensions: allowedTypes,
    });

    if (errors.length > 0 || safeFiles.length === 0) {
      return NextResponse.json(
        { error: "File validation failed", details: errors },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const uploadResult = await uploadFile(safeFiles[0], auth.user!.id, {
      type: isImage ? "images" : "audio",
    });

    // Store metadata in PostgreSQL using your Attachment model
    const attachment = await prisma.attachment.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: uploadResult.url, // ✅ Blob URL
        projectId: projectId || "default", // Or create project if needed
        userId: auth.user!.id,
        // Optional: Add category for filtering
        category: isImage ? "image" : "audio",
      },
    });

    return NextResponse.json({
      id: attachment.id,
      url: uploadResult.url, // Use this to display/download
      filename: attachment.filename,
      size: attachment.sizeBytes,
      type: attachment.mimeType,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

### Step 3: Update Prisma Schema (Optional Enhancements)

Your `Attachment` model is already good! Consider adding:

```prisma
model Attachment {
  id         String   @id @default(cuid())
  projectId  String
  runId      String?
  filename   String
  mimeType   String
  sizeBytes  Int
  storageKey String   // ✅ Already perfect for Blob URLs!
  createdAt  DateTime @default(now())
  
  // Optional: Add these for better organization
  userId     String?  // Who uploaded it
  category   String?  // "image", "audio", "document", etc.
  
  // Relations
  project Project @relation(fields: [projectId], references: [id])
  run     Run?    @relation(fields: [runId], references: [id])
  
  @@index([projectId, createdAt])
  @@index([userId, createdAt])
  @@index([category]) // For filtering by type
}
```

### Step 4: Frontend Upload Component

```typescript
// src/components/MediaUpload.tsx
"use client";

import { useState } from "react";

export function MediaUpload({ projectId }: { projectId?: string }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (projectId) formData.append("projectId", projectId);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setResult({ url: data.url, filename: data.filename });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {result && (
        <div>
          <p>Uploaded: {result.filename}</p>
          <img src={result.url} alt={result.filename} className="max-w-xs" />
        </div>
      )}
    </div>
  );
}
```

### Step 5: Display Media

```typescript
// src/components/MediaDisplay.tsx
"use client";

import { useEffect, useState } from "react";

export function MediaDisplay({ attachmentId }: { attachmentId: string }) {
  const [attachment, setAttachment] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/attachments/${attachmentId}`)
      .then(res => res.json())
      .then(setAttachment);
  }, [attachmentId]);

  if (!attachment) return <div>Loading...</div>;

  const isImage = attachment.mimeType?.startsWith("image/");
  const isAudio = attachment.mimeType?.startsWith("audio/");

  return (
    <div>
      {isImage && (
        <img 
          src={attachment.storageKey} // ✅ Blob URL from database
          alt={attachment.filename}
          className="max-w-full rounded-lg"
        />
      )}
      {isAudio && (
        <audio controls src={attachment.storageKey} className="w-full">
          Your browser does not support audio.
        </audio>
      )}
      <p className="text-sm text-gray-600 mt-2">
        {attachment.filename} ({(attachment.sizeBytes / 1024).toFixed(1)} KB)
      </p>
    </div>
  );
}
```

---

## 🎯 Why This Approach is Perfect

### ✅ **Scalability**
- **Vercel Blob**: Handles petabytes, no database bloat
- **CDN**: Automatic global distribution
- **Cost**: ~$0.15/GB/month (cheap!)

### ✅ **Performance**
- **Database**: Fast queries on small metadata
- **Blob**: Optimized for large file retrieval
- **No Database Bloat**: Database stays lean

### ✅ **Your Prisma Schema is Ready**
- `storageKey` field stores Blob URLs ✅
- `mimeType` for content type ✅
- `sizeBytes` for file size ✅
- Relations to projects/runs ✅

### ✅ **Security**
- Authentication required (your `requireAuth`)
- File validation (your `validateUpload`)
- Path-based isolation (`ai-studio/{userId}/...`)

---

## 📊 Storage Comparison

| Storage Type | Use Case | Your Setup |
|-------------|----------|------------|
| **Vercel Blob** | Images, audio, videos, documents | ✅ Configured |
| **PostgreSQL** | Metadata, relationships, queries | ✅ Prisma ready |
| **Database BLOB** | ❌ Don't use | Not recommended |

---

## 🚀 Next Steps

1. **✅ Already Done:**
   - Vercel Blob configured
   - Upload utilities (`src/lib/ai-studio/storage.ts`)
   - Prisma schema with `Attachment` model

2. **To Add:**
   - Media upload endpoint (`/api/media/upload`)
   - Frontend upload component
   - Display components for images/audio

3. **Optional Enhancements:**
   - Image metadata extraction (dimensions, EXIF)
   - Audio metadata extraction (duration, bitrate)
   - Thumbnail generation for images
   - Audio waveform generation

---

## 📚 Resources

- **Your existing code**: `src/lib/ai-studio/storage.ts` (perfect example!)
- **Vercel Blob Docs**: https://vercel.com/docs/storage/vercel-blob
- **Prisma Docs**: https://www.prisma.io/docs

---

## ✅ Summary

**You're already doing it right!** Just extend your existing pattern:

1. Upload file → Vercel Blob (use your `uploadFile` function)
2. Store metadata → PostgreSQL (use your `Attachment` model)
3. Store Blob URL in `storageKey` field ✅

**No need to store files in the database!** Your architecture is future-proof and scalable. 🎉
