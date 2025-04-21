import { boot } from 'quasar/wrappers'
import { Capacitor } from '@capacitor/core'

const isAndroid = Capacitor.getPlatform() === 'android'

// Custom logger for Android
const androidLog = {
  log: (...args) => {
    if (isAndroid) {
      console.log('ANDROID_APP:', ...args)
    } else {
      console.log(...args)
    }
  },
  error: (...args) => {
    if (isAndroid) {
      console.error('ANDROID_APP_ERROR:', ...args)
    } else {
      console.error(...args)
    }
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$log = androidLog
})

export { androidLog }