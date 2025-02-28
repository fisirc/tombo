import { Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LocalMedia } from '@/types';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';

export type ImageInputProps = {
  label: string
  value: LocalMedia[]
  onChange: (value: LocalMedia[]) => void
}

export default function ImageInput({ label, value, onChange }:
  ImageInputProps
) {
  const updateValue = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) {
      return
    }

    if (result.assets.some((a) => (!a.uri || !a.mimeType || !a.fileName))) {
      throw new Error('Invalid image')
    }

    const media: LocalMedia[] = value.concat(
      result.assets.map((a) => ({
        uri: a.uri,
        type: a.mimeType as string,
        name: a.fileName as string
      }))
    )

    onChange(media)
  }

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    updateValue(result)
  };

  const onTakePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    console.log(`Uploaded image: ${result}`)
    updateValue(result)
  }

  return (
    <View className="flex gap-2">
      <Text className='text-default'>
        {label}
      </Text>
      {
        value.length
        ? <PagerView style={{ height: 250 }} pageMargin={16} >
          {
            value.map((image) => (
              <Image
                key={image.uri}
                source={image}
                style={{ borderRadius: 12, height: 250 }}
              />
            ))
          }
          </PagerView>
        : null
      }
      <View className={`flex flex-row gap-2 w-full`}>
        <Pressable
          className={`flex-grow rounded-xl h-16 items-center justify-center p-4 bg-foreground active:bg-foreground-mild`}
          onPress={onPickImage}
        >
          <Text className={`font-medium text-default`}>
            Abrir galería
          </Text>
        </Pressable>
        <Pressable
          className={`flex-grow rounded-xl h-16 items-center justify-center p-4 bg-foreground active:bg-foreground-mild`}
          onPress={onTakePicture}
        >
          <Text className={`font-medium text-default`}>
            Tomar foto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
