import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// The encryption key should be 32 bytes (256 bits) for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Derive a 32-byte key from the provided encryption key
const derivedKey = scryptSync(ENCRYPTION_KEY, 'salt', 32);

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

export function encrypt(text: string): EncryptedData {
  // Generate a random initialization vector
  const iv = randomBytes(12);
  
  // Create cipher using the derived key
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decrypt(encryptedData: EncryptedData): string {
  try {
    // Create decipher using the derived key
    const decipher = createDecipheriv(
      ALGORITHM,
      derivedKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    // Set the authentication tag
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed. Data may be corrupted or tampered with.');
  }
}

// Utility function to check if a string is encrypted
export function isEncryptedData(data: any): data is EncryptedData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'encryptedData' in data &&
    'iv' in data &&
    'authTag' in data
  );
} 