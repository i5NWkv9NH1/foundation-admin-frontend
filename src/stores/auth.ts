// stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import { apiAuth } from '@/api';
import type { Account, Permissions, SigninPayload, SignupPayload } from '@/types';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/helpers';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(getLocalStorageItem('accessToken', ''));
  const refreshToken = ref<string | null>(getLocalStorageItem('refreshToken', ''));
  const account = ref<Account>(getLocalStorageItem('account', {}));
  const permissions = ref<Permissions>(getLocalStorageItem('permissions', {})) || { menus: [], actions: [] };

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    setLocalStorageItem('accessToken', newAccessToken);
    setLocalStorageItem('refreshToken', newRefreshToken);
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
    removeLocalStorageItem('accessToken');
    removeLocalStorageItem('refreshToken');
  }

  function setAccount(newAccount: Account) {
    account.value = newAccount;
    localStorage.setItem('account', JSON.stringify(newAccount));
  }

  function clearAccount() {
    account.value = {} as any;
    removeLocalStorageItem('account');
  }

  function setPermissions(newPermissions: { menus: any[]; actions: any[] }) {
    permissions.value = newPermissions;
    setLocalStorageItem('permissions', JSON.stringify(newPermissions));
  }

  function clearPermissions() {
    permissions.value = { menus: [], actions: [] };
    removeLocalStorageItem('permissions');
  }

  async function refresh() {
    try {
      const {
        data: { result }
      } = await apiAuth.refreshToken({ refreshToken: refreshToken.value! });
      setTokens(result.accessToken, result.refreshToken);
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
      const {
        data: { result }
      } = await apiAuth.signin(payload);
      setTokens(result.accessToken, result.refreshToken);
      setAccount(result.account);
      setPermissions(result.permissions);
      router.push('/'); // Redirect to a default or dashboard page
    } catch (error) {
      throw new Error('Signin failed');
    }
  }

  async function signup(payload: SignupPayload) {
    try {
      const {
        data: { result }
      } = await apiAuth.signup(payload);
      setAccount(result.account);
      setPermissions(result.permissions);
      await router.push('/dashboard');
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
