import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chempro.app',
  appName: 'Chem Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true // Allow http for development
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
