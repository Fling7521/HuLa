import Http, { HttpParams } from './http.ts'
import { ServiceResponse } from '@/services/types.ts'

function getToken() {
  let tempToken = ''
  return {
    get() {
      if (tempToken) return tempToken
      const token = localStorage.getItem('TOKEN')
      if (token) {
        tempToken = token
      }
      return tempToken
    },
    clear() {
      tempToken = ''
    }
  }
}

export const computedToken = getToken()

// fetch 请求响应拦截器
const responseInterceptor = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  query: any,
  body: any,
  abort?: AbortController,
  noRetry?: boolean
): Promise<T> => {
  let httpParams: HttpParams = {
    method,
    noRetry
  }

  if (method === 'GET') {
    httpParams = {
      ...httpParams,
      query
    }
  } else {
    url = `${url}?${new URLSearchParams(query).toString()}`
    httpParams = {
      ...httpParams,
      body
    }
  }

  try {
    const data = await Http(url, httpParams, true, abort)
    const serviceData = (await data.data) as ServiceResponse
    //检查服务端返回是否成功，并且中断请求
    if (!serviceData.success) {
      window.$message.error(serviceData.errMsg)
      return Promise.reject(`http error: ${serviceData.errMsg}`)
    }
    return Promise.resolve(serviceData.data)
  } catch (err) {
    return Promise.reject(`http error: ${err}`)
  }
}

const get = async <T>(url: string, query: T, abort?: AbortController, noRetry?: boolean): Promise<T> => {
  return responseInterceptor(url, 'GET', query, {}, abort, noRetry)
}

const post = async <T>(url: string, params: any, abort?: AbortController, noRetry?: boolean): Promise<T> => {
  return responseInterceptor(url, 'POST', {}, params, abort, noRetry)
}

const put = async <T>(url: string, params: any, abort?: AbortController, noRetry?: boolean): Promise<T> => {
  return responseInterceptor(url, 'PUT', {}, params, abort, noRetry)
}

const del = async <T>(url: string, params: any, abort?: AbortController, noRetry?: boolean): Promise<T> => {
  return responseInterceptor(url, 'DELETE', {}, params, abort, noRetry)
}

export default {
  get,
  post,
  put,
  delete: del
}
