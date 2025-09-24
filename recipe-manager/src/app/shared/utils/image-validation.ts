// reusable image validation helper
// Returns null if valid, otherwise a human-readable error string.
export interface ImageValidationOptions {
  allowedMime?: string[]; // list of allowed mime types
  maxSizeMB?: number; // maximum file size in MB (raw before compression)
}

const DEFAULT_ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp'];
const EXTENSION_FALLBACK: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export function validateImageFile(
  file: File,
  opts: ImageValidationOptions = {}
): string | null {
  const allowed = opts.allowedMime || DEFAULT_ALLOWED_MIME;
  const maxSizeMB = opts.maxSizeMB ?? 5; // allow up to 5MB pre-compression

  let mime = file.type;
  if (!mime) {
    // fallback to extension if browser didn't populate type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    mime = EXTENSION_FALLBACK[ext] || '';
  }

  if (!allowed.includes(mime)) {
    return `Unsupported file type. Allowed: ${allowed
      .map((m) => m.split('/')[1])
      .join(', ')}`;
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return `File is too large (${sizeMB.toFixed(
      2
    )}MB). Max allowed is ${maxSizeMB}MB.`;
  }

  return null;
}
