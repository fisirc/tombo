import { ProfileData } from "@/types"

export const ProfileService = {
  getProfile: async () => {
    const data: ProfileData = {
      name: 'John Doe',
      phone: '1234567890',
      notifications: true
    }
    return data
  },
  updateProfile: async (data: ProfileData) => {
    console.log('Profile updated:', data)
  }
}
