// stores/auth.ts
import { Account, SigninPayload, SignupPayload } from '@/types';
import { defineStore } from 'pinia';
import router from '@/router';
import { apiAuth } from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    account: JSON.parse(localStorage.getItem('account') || '{}') as Account,
    permissions: {} as { menus: any[]; acctions: any[] }
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    },
    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setAccount(account: Account) {
      this.account = account;
      localStorage.setItem('account', JSON.stringify(account));
    },
    clearAccount() {
      this.account = {} as any;
      localStorage.removeItem('account');
    },
    async handleRefreshToken() {
      try {
        const response = await apiAuth.refreshToken({ refreshToken: this.refreshToken as string });
        this.setTokens(response.data.result.accessToken, response.data.result.refreshToken);
      } catch (error) {
        this.clearTokens();
        this.clearAccount();
        router.push('/auth/signin');
        throw new Error('Token refresh failed');
      }
    },
    async signin(payload: SigninPayload) {
      try {
        const response = await apiAuth.signin(payload);
        this.setTokens(response.data.result.accessToken, response.data.result.refreshToken);
        this.setAccount(response.data.result.account);
        router.push('/'); // Redirect to a default or dashboard page
      } catch (error) {
        throw new Error('Signin failed');
      }
    },
    async signup(payload: SignupPayload) {
      try {
        const response = await apiAuth.signup(payload);
        this.setTokens(response.data.result.accessToken, response.data.result.refreshToken);
        this.setAccount(response.data.result.account);
        router.push('/dashboard'); // Redirect to a default or dashboard page
        console.debug('AuthStore');
      } catch (error) {
        throw new Error('Registration failed');
      }
    }
  },
  getters: {
    getAccountName(): string {
      return this.account.name || this.account.username || '';
    },
    isAuthenticated(): boolean {
      return !!this.accessToken;
    }
  }
});
