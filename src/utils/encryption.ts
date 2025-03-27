import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const encryptData = (data: string): string => {
    const encrytedData = CryptoJS.AES.encrypt(data, process.env.KEY || 'defaultKey').toString();
    console.log("EncryptedData", encrytedData);
    return encrytedData;
}

const decryptData = (encryptedData: string): string => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.KEY || 'defaultKey').toString(CryptoJS.enc.Utf8);
    const extractedData = decryptedData.split('!+_id_+!')[0];
    console.log("DecryptedData", decryptedData);
    console.log("ExtractedDate", extractedData);
    return extractedData;
}

export { encryptData, decryptData };
