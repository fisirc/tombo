import { ImageSource } from "expo-image"

export type Profile = {
  name: string
  email?: string
  phone: string
  photo?: string
  notifications: boolean
  notificationsRadius: number
}

export type ReportType = {
  name: string
  icon: string
}

export type Report = {
  id: string
  latitude: number
  longitude: number
  description: string
  date: Date
  reportType: string
  address: string
  multimediaReports: Media[]
}

export type ReportForm = {
  latitude: number
  longitude: number
  description: string
  reportType: string
  address: string
  multimediaReports: LocalMedia[]
  location: {
    latitude: number
    longitude: number
    address?: string
  }
}

export type ReportComment = {
  id: string
  message: string
  reportId: string
  userId: string
  createdAt: string
}

export type ReportCommentForm = {
  message: string
  reportId: string
}

export type Media = {
  id: string
  resource: string
}

export type LocalMedia = {
  uri: string
  name: string
  type: string
}
