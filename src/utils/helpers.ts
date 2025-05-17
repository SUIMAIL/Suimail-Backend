import mongoose from "mongoose"

export const generateRandomSuiNs = async (): Promise<string> => {
  const timestamp = Date.now().toString(36)
  const randomValue = Math.random().toString(36).substring(2, 7)
  const randomString = `${timestamp}${randomValue}`.substring(0, 5)

  const existingUser = await mongoose.model("User").findOne({
    suimailNs: `${randomString}@suimail`,
  })
  if (existingUser) {
    return generateRandomSuiNs()
  }

  return `${randomString}@suimail`
}
