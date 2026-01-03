# InGate – Expo (React Native)

A React Native app built with Expo and Expo Router.

## Quick start (this project)

1) Install dependencies:
npm install 


3) Configure environment (Clerk)
Create a .env file in the project root and insert the Clerk publishable key of your application created in the Clerk dashboard which will be like : 
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... 
Do not add server-only secrets (e.g., CLERK_SECRET_KEY) to this client app.

4) Start the app
   

npx expo start --tunnel       #recommended

or 

npx expo start -c

or

npx expo start




5) Open the app
- Press a to open Android emulator (Android Studio required)
- Press i to open iOS simulator (macOS + Xcode)
- Scan the QR with the Expo Go app on a mobile device
- Press w to open in the web browser

Notes:
- File-based routing lives in the app/ directory (Expo Router).
- A custom URL scheme myapp is configured for OAuth redirects.
- The app will automatically reload when you save changes to code.

## Create a new Expo app (from scratch)

If you want to start a new native Expo app:
npx create-expo-app@latest my-app

cd my-app

npx expo start

Open it on device/emulator using the same options above.

## Useful scripts
bash:
npm run start   # Start dev server (alias of expo start) and 
npm run android # Open Android emulator  and  
npm run ios     # Open iOS simulator (macOS only)  and  
npm run web     # Open in a web browser

## Troubleshooting
- After editing .env, fully restart the dev server.
- For Clerk in test mode, view email codes in Clerk Dashboard if no email provider is configured.
