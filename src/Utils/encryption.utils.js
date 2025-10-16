import crypto from "node:crypto";

const IV_LENGTH = +process.env.IV_LENGTH;
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY);

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);

  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decrypt = (encryptedData) => {
  const [iv, encryptedText] = encryptedData.split(":");
  const binaryLikeIv = Buffer.from(iv, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    binaryLikeIv
  );

  let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData;
};

// 🔐 استخدام المفاتيح من .env بدلاً من ملفات
export const asymmetricEncryption = (text) => {
  const publicKey = process.env.PUBLIC_KEY;
  const bufferedText = Buffer.from(text);

  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    bufferedText
  );

  return encryptedData.toString("hex");
};

export const asymmetricDecryption = (text) => {
  const privateKey = process.env.PRIVATE_KEY;
  const buffer = Buffer.from(text, "hex");

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  return decryptedData.toString("utf-8");
};
