import { Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MediaAsset } from "@/types";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import Button from "./Button";

export type ImageInputProps = {
  label: string;
  value: MediaAsset[];
  onChange: (value: MediaAsset[]) => void;
};

export default function ImageInput({
  label,
  value: assets,
  onChange,
}: ImageInputProps) {
  const updateValue = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) {
      return;
    }

    if (result.assets.some((a) => !a.uri || !a.mimeType || !a.fileName)) {
      throw new Error("Invalid image");
    }

    const media: MediaAsset[] = assets.concat(result.assets);

    onChange(media);
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    updateValue(result);
  };

  const onTakePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    console.log(`Uploaded image: ${result}`);
    updateValue(result);
  };

  return (
    <View className="flex gap-2">
      <Text className="text-default">{label}</Text>
      {assets.length ? (
        <PagerView style={{ height: 250 }} pageMargin={16}>
          {assets.map((asset) => (
            <Image
              key={asset.uri}
              source={{ uri: asset.uri }}
              style={{ borderRadius: 12, height: 250 }}
            />
          ))}
        </PagerView>
      ) : null}
      <View className={`flex flex-row gap-2`}>
        <Button
          variant="secondary"
          label="Abrir galería"
          onPress={onPickImage}
        />
        <Button
          variant="secondary"
          label="Tomar foto"
          onPress={onTakePicture}
        />
      </View>
    </View>
  );
}
