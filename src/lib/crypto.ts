const salt = new Uint8Array([
  208, 215, 181, 181, 61, 255, 49, 85, 121, 149, 221, 70, 81, 192, 144, 190,
]);

const iv = new Uint8Array([
  80, 16, 10, 229, 233, 184, 212, 126, 36, 67, 245, 228,
]);

const subtle = window.crypto.subtle;

/*
 * Get some key material to use as input to the deriveKey method.
 * The key material is a password supplied by the user.
 */
function getKeyMaterial(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  );
}

/*
 * Given some key material derive an AES-GCM key using PBKDF2.
 */
function getKey(keyMaterial: CryptoKey): Promise<CryptoKey> {
  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
}

/*
 * Derive a key from a password supplied by the user, and use the key
 * to encrypt the data.
 */
async function encrypt(
  data: BufferSource,
  password: string,
): Promise<ArrayBuffer> {
  const keyMaterial = await getKeyMaterial(password);
  const key = await getKey(keyMaterial);

  return subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data,
  );
}

/*
 * Derive a key from a password supplied by the user, and use the key
 * to decrypt the ciphertext.
 */
async function decrypt(
  data: BufferSource,
  password: string,
): Promise<ArrayBuffer> {
  const keyMaterial = await getKeyMaterial(password);
  const key = await getKey(keyMaterial);

  return await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data,
  );
}

export { encrypt, decrypt };
