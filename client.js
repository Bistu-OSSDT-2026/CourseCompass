import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器：统一处理错误
client.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200 && data.code !== 201) {
      const error = new Error(data.message || '请求失败')
      error.response = response
      return Promise.reject(error)
    }
    return data.data
  },
  (error) => {
    if (error.response) {
      const msg =
        error.response.data?.message || `服务器错误 (${error.response.status})`
      return Promise.reject(new Error(msg))
    }
    if (error.request) {
      return Promise.reject(new Error('网络连接失败，请检查网络'))
    }
    return Promise.reject(error)
  }
)

export default client
