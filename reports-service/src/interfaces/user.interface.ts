export interface IPreferences {
  id: string;
  activeNotifications: boolean;
  alertRadiusKm: number;
  interfaceTheme: string;
  language: string;
}

export interface IUser {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  phone: string;
}

export interface IProfile {
  name: string;
  email: string;
  phone: string;
  photo: string;
  notifications: boolean;
  notificationsRadius: number;
}
