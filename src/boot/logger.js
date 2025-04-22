import { boot } from 'quasar/wrappers'
import { Capacitor } from '@capacitor/core'

const isAndroid = Capacitor.getPlatform() === 'android'

// Helper function to safely stringify objects
const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack
        };
      }
      return value;
    }, 2);
  } catch (e) {
    return String(obj);
  }
}

// Custom logger for Android
const androidLog = {
  log: (...args) => {
    if (isAndroid) {
      const formattedArgs = args.map(arg =>
        typeof arg === 'object' ? safeStringify(arg) : String(arg)
      );
      console.log('ANDROID_APP:', ...formattedArgs);
    } else {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isAndroid) {
      const formattedArgs = args.map(arg =>
        typeof arg === 'object' ? safeStringify(arg) : String(arg)
      );
      console.error('ANDROID_APP_ERROR:', ...formattedArgs);
    } else {
      console.error(...args);
    }
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$log = androidLog
})

export { androidLog }
