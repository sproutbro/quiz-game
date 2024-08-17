import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const CRYPTO_KEY = process.env.CRYPTO_KEY;
const CRYPTO_IV = process.env.CRYPTO_IV;

const algorithm = "aes-256-cbc";
const key = Buffer.from(CRYPTO_KEY, "hex");
const iv = Buffer.from(CRYPTO_IV, "hex");

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export { encrypt, decrypt };
