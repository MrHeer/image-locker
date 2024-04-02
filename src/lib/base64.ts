function base64ToBuffer(base64: string): ArrayBuffer {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    '',
  );
  return btoa(binary);
}

export { base64ToBuffer, bufferToBase64 };
