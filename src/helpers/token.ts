import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  const decoded: any = jwtDecode(token);
  const now = Date.now() / 1000; // 当前时间戳（秒）
  return decoded.exp < now;
};
