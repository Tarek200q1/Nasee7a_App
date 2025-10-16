import crypto from "node:crypto";
import fs from "node:fs";

const IV_LENGTH = +process.env.IV_LENGTH;
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY );

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    iv
  );

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


if(fs.existsSync('publicKey.pem') && fs.existsSync('privateKey.pem')){

    console.log('Key already generated');

}else{
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2084,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

fs.writeFileSync("publicKey.pem", publicKey);
fs.writeFileSync("privateKey.pem", privateKey);
};



export const asymmetricEncryption = (text)=>{

    const publicKey = fs.readFileSync('publicKey.pem' , 'utf-8');

    const bufferedText = Buffer.from(text);

    const encryptedData  = crypto.publicEncrypt(
        {
            key : publicKey,
            padding : crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        bufferedText
    )

    return encryptedData.toString('hex')
};


export const asymmetricDecryption = (text)=>{

    const privateKey = fs.readFileSync('privateKey.pem' , 'utf-8');

    const buffer = Buffer.from(text , 'hex');

    const decryptedData = crypto.privateDecrypt(
        {
            key : privateKey,
             padding : crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer
    )

    return decryptedData.toString('utf-8')
};

