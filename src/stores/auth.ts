// stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { apiAuth } from '@/api';
import type { Account, Permissions, SigninPayload, SignupPayload } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const account = ref<Account>(JSON.parse(localStorage.getItem('account') || '{}'));
  const permissions = ref<Permissions>(JSON.parse(localStorage.getItem('permissions')!)) || { menus: [], actions: [] };

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    localStorage.setItem('access_token', newAccessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  function setAccount(newAccount: Account) {
    account.value = newAccount;
    localStorage.setItem('account', JSON.stringify(newAccount));
  }

  function clearAccount() {
    account.value = {} as any;
    localStorage.removeItem('account');
  }

  function setPermissions(newPermissions: { menus: any[]; actions: any[] }) {
    permissions.value = newPermissions;
    localStorage.setItem('permissions', JSON.stringify(newPermissions));
  }

  function clearPermissions() {
    permissions.value = { menus: [], actions: [] };
    localStorage.removeItem('permissions');
  }

  async function refresh() {
    try {
      const response = await apiAuth.refreshToken({ refreshToken: refreshToken.value! });
      setTokens(response.data.result.accessToken, response.data.result.refreshToken);
    } catch (error) {
      clearTokens();
      clearAccount();
      clearPermissions();
      router.push('/auth/signin');
      throw new Error('Token refresh failed');
    }
  }

  async function signin(payload: SigninPayload) {
    try {
      const response = await apiAuth.signin(payload);
      setTokens(response.data.result.accessToken, response.data.result.refreshToken);
      setAccount(response.data.result.account);
      setPermissions(response.data.result.permissions);
      router.push('/'); // Redirect to a default or dashboard page
    } catch (error) {
      throw new Error('Signin failed');
    }
  }

  async function signup(payload: SignupPayload) {
    try {
      const response = await apiAuth.signup(payload);
      setAccount(response.data.result.account);
      setPermissions(response.data.result.permissions);
      router.push('/dashboard');
      console.debug('AuthStore');
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async function logout() {
    try {
      await apiAuth.logout({ accessToken: accessToken.value!, refreshToken: refreshToken.value! });
      clearTokens();
      clearAccount();
      clearPermissions();
      router.push('/auth/signin');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async function findMe() {
    try {
      // Implementation of findMe
    } catch (error) {
      throw new Error('Find me failed');
    }
  }

  const getAccountName = computed(() => account.value.name || account.value.username || '');
  const isAuthenticated = computed(() => !!accessToken.value);

  return {
    accessToken,
    refreshToken,
    account,
    permissions,
    setTokens,
    clearTokens,
    setAccount,
    clearAccount,
    setPermissions,
    clearPermissions,
    refresh,
    signin,
    signup,
    logout,
    findMe,
    getAccountName,
    isAuthenticated
  };
});
