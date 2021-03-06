import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: "io.ionic.starter",
	appName: "foodfind",
	webDir: "www",
	bundledWebRuntime: false,
    plugins: {
        SplashScreen: {
            launchShowDuration: 4000,
            launchAutoHide: true,
            backgroundColor: "#2583b3",
            showSpinner: true,
            splashImmersive: true,
            androidSpinnerStyle: 'large',
            androidScaleType: "CENTER_CROP",
            spinnerColor: "#6fe864"
        }
    }
}

export default config