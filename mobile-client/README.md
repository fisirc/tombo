# NativeWind Example

Style your universal React app with Tailwind CSS classes. [NativeWind](https://www.nativewind.dev/) enables Tailwind CSS use in React Native apps.

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 🚀 How to use

- Install with `yarn` or `npm install`.
- Run `yarn start` or `npm run start` to try it out.

## Creating an Android keystore

You will be prompted for information about the authors and a password that you must save

```bash
keytool -genkeypair -v -keystore tombo.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias tombo
```

To get the SHA-1 of the keystore, run

```bash
keytool -list -v -keystore tombo.keystore -alias tombo
```

```bash
npx expo prebuild -p android --clean
```

And run the project with

```bash
npx expo run:android --device
```
