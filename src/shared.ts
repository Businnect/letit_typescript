export interface FilePayload {
  filename: string;
  bytes: Uint8Array | ArrayBuffer;
  mimeType?: string;
}

export function toBlob(file: FilePayload): Blob {
  const normalizedBytes =
    file.bytes instanceof ArrayBuffer
      ? new Uint8Array(file.bytes)
      : Uint8Array.from(file.bytes);

  return new Blob([normalizedBytes], {
    type: file.mimeType ?? "application/octet-stream",
  });
}