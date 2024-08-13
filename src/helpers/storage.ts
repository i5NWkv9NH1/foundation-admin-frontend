// 设置 cookie 的辅助函数
export function setCookie(name: string, value: string, days: number) {
  const expires = `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// 获取 cookie 的辅助函数
export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
}

export const getLocalStorageItem = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(key);
  return item ? (typeof item === 'object' ? JSON.parse(item) : item) : defaultValue;
};

export const setLocalStorageItem = (key: string, value: any) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  localStorage.setItem(key, value);
};
