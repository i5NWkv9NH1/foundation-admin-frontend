export function setCookie(name: string, value: string, days: number) {
  const expires = `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export const getLocalStorageItem = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key)
  try {
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    // 如果 JSON.parse 失败，返回原始值
    return item ?? defaultValue
  }
}

export const setLocalStorageItem = (key: string, value: any) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value))
    return
  }
  localStorage.setItem(key, value)
}
export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key)
}

export function parseJSON(value: string): any {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}
