// TS declaration for browser-image-compression
// for importing and using the library without type errors.
// must stay in 'typings' folder for proper mtc (default for custom/global type declarations)

declare module 'browser-image-compression' {
  export default function imageCompression(
    file: File,
    options?: {
      maxSizeMB?: number;
      maxWidthOrHeight?: number;
      useWebWorker?: boolean;
      [key: string]: any;
    }
  ): Promise<File>;
}
