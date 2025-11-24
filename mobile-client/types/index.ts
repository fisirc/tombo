import { Icon } from "@tabler/icons-react-native";
import { ImagePickerAsset } from "expo-image-picker";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export type MediaAsset = ImagePickerAsset;
