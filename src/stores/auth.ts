// stores/auth.ts
import { Account } from '@/types';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    account: JSON.parse(localStorage.getItem('account') || '{}')
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
      this.account = {};
      localStorage.removeItem('account');
    },
    isAuthenticated(): boolean {
      return !!this.accessToken;
    }
  },
  getters: {
    getAccountName(): string {
      return this.account.name || this.account.username || '';
    }
  }
});
