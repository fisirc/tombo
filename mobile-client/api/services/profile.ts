import { Profile, ReportType } from "@/types"

export const ProfileService = {
  getProfile: async () => {
    const data: Profile = {
      name: 'John Doe',
      phone: '1234567890',
      notifications: true,
      notificationsRadius: 5
    }
    return data
  },
  updateProfile: async (data: Profile) => {
    console.log('Profile updated:', data)
  }
}
