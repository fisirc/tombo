/*import { Profile, ReportType } from "@/types"

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
}*/

import type { Profile } from "@/types"

// This is a mock implementation - replace with your actual API service
export const ProfileService = {
  getProfile: async (): Promise<Profile> => {
    // Check if user is logged in and fetch profile
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user`)

    if (!response.ok) {
      throw new Error("User not found or not logged in")
    }

    return response.json()
  },

  updateProfile: async (profile: Profile): Promise<Profile> => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    return response.json()
  },

  createProfile: async (profile: Profile): Promise<Profile> => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error("Failed to create profile")
    }

    return response.json()
  },

  // New method to check if a user exists by email
  checkUserExists: async (googleId: string): Promise<boolean> => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/google/${encodeURIComponent(googleId)}`)
    return response.ok // If status is 200, user exists
  },
}
