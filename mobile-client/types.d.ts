import { ImageSource } from "expo-image"

export type Profile = {
  name: string
  phone: string
  notifications: boolean
  notificationsRadius: number
}

export type ReportType = {
  name: string
  icon: string
}

export type Report = {
  id: number
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
}

export type ReportComment = {
  id: number
  content: string
  createdAt: Date
}

export type Media = {
  id: number
  resource: string
}

export type LocalMedia = {
  uri: string
  name: string
  type: string
}
