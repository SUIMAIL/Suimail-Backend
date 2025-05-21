import CryptoJS from "crypto-js"
import dotenv from "dotenv"

dotenv.config()

const encryptData = (data: string): string => {
  const encrytedData = CryptoJS.AES.encrypt(
    data,
    process.env.KEY || "defaultKey"
  ).toString()
  return encrytedData
}

const decryptData = (encryptedData: string): string => {
  const truncatedEncryptedData = encryptedData.split("!!!")[0]
  const decryptedData = CryptoJS.AES.decrypt(
    truncatedEncryptedData,
    process.env.KEY || "defaultKey"
  )
  const extractedData = decryptedData.toString(CryptoJS.enc.Utf8)
  return extractedData
}

export { encryptData, decryptData }
