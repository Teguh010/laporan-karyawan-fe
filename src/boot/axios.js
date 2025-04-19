import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://p4sksg888k4s0okcgcwg4wks.152.53.231.3.sslip.io',  // Your Coolify backend URL
  headers: {
    'Content-Type': 'application/json',
  }
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
