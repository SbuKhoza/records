# QK Voice Recorder

QK Voice Recorder is a mobile application built using React Native and Expo. It allows users to record, play, rename, and delete voice recordings with a simple and intuitive interface.

## Features

- **High-Quality Audio Recording**: Records audio in MP3 format with high bitrate and sample rate.
- **Playback Speed Control**: Adjust playback speed (0.5x, 1x, 1.5x, 2x).
- **Rename Recordings**: Easily rename your recordings.
- **Search Functionality**: Quickly search for recordings by name.
- **Delete Recordings**: Remove unwanted recordings with ease.
- **Cross-Platform Support**: Works on iOS, Android, and Web.

## Prerequisites

Before running the app, ensure you have the following installed:

- Node.js
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
Install dependencies:
bash
Copy code
npm install
Usage
To start the app:

For development:

bash
Copy code
npm run start
Run on Android:

bash
Copy code
npm run android
Run on iOS:

bash
Copy code
npm run ios
Run on Web:

bash
Copy code
npm run web
Directory Structure
bash
Copy code
.
├── App.js                   # Main app entry point
├── package.json             # Project configuration and dependencies
├── screens/
│   ├── Home.js              # Home screen component
│   ├── Splash.js            # Splash screen component
│   ├── Recordings.js        # Recordings screen component
└── README.md                # Project documentation
Dependencies
The project uses the following dependencies:

expo: Expo framework for React Native apps.
@react-navigation/native & @react-navigation/stack: Navigation framework for managing screens.
expo-av: Handles audio playback and recording.
expo-file-system: Manages file storage and retrieval.
@expo-google-fonts/orbitron: Custom font for the UI.
react-native-safe-area-context & react-native-screens: For safe area and screen management.
@react-native-async-storage/async-storage: Local storage for managing app data.
For the full list, refer to the package.json file.

License
This project is licensed under the Zero-Clause BSD (0BSD) license.