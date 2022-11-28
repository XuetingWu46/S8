# S8
For the implementation of <https://challenges.synpulse8.com/front-end-engineer/>, I use React Native framework and JavaScript language. It is essential to set up the environment before running this project. 

## Environment Setup
#### 1. Setting up development environment
Please refer to React Native [Website](https://reactnative.dev/docs/environment-setup), click “React Native CLI Quickstart”. The official installation tutorial will vary depending on your Development OS and Target OS choices. For our project, you can choose operating system of your device as “Development OS” and “Android” as “Target OS”.
#### 2. Download Android Studio
Once you've configured your environment, open this project in Android Studio. If there is no Android Studio in your device, download it from [here](https://developer.android.com/studio).
#### 3. Android hardware/emulator
Next, in order for Android application to run, there must be an [Android hardware](https://developer.android.com/studio/run/device) device or an [Android emulator](https://developer.android.com/studio/run/emulator) installed.
#### 4. Firebase configuration and Alpha Vantage API key
If you want to change your own configuration about Firebase and Alpha Vantage, please edit the corresponding information in _src/assets/config/config.js_. 
#### 5. Run this project
Make sure you have an emulator running or a real device connected first, then run _**npx react-native run-android**_ in your project directory. If you use the Yarn package manager, you can use yarn instead of npx when running React Native commands inside this project.