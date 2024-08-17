// stores/auth.ts
import { defineStore } from 'pinia';
import router from '@/router';
import { apiAuth } from '@/api';
import type { Token, Account, Permissions, SigninPayload, SignupPayload, Status, Gender, Menu } from '@/types';
import { RouteRecordRaw } from 'vue-router';

const defaultAccount = { id: '', name: '', username: '', phone: '', address: '', email: '', avatarUrl: '', roles: [], status: 'ENABLE' as Status, createdAt: '', updatedAt: '', gender: 'FEMALE' as Gender };
export const useAuthStore = defineStore(
  'auth',
  () => {
    const logger = (fnName: string, ...rest: string[]) => `${useAuthStore.name}::${fnName}::${rest}`;
    const token = ref<Token>({
      accessToken: '',
      refreshToken: ''
    });
    const account = ref<Account>({ ...defaultAccount });
    const permissions = ref<Permissions>({ actions: [], menus: [] });
    let routes = [];

    function setTokens(_token: Token) {
      token.value = _token;
    }
    function clearTokens() {
      token.value = { accessToken: '', refreshToken: '' };
    }
    function setAccount(_account: Account) {
      account.value = _account;
    }
    function clearAccount() {
      account.value = { ...defaultAccount };
    }

    function setPermissions(_permissions: Permissions) {
      permissions.value = _permissions;
    }

    function clearPermissions() {
      permissions.value = { menus: [], actions: [] };
    }

    async function refresh() {
      try {
        const response = await apiAuth.refreshToken({ refreshToken: token.value.refreshToken });
        setTokens(response.data.result);
      } catch (error) {
        clearTokens();
        clearAccount();
        clearPermissions();
        router.push('/auth/signin');
        throw new Error(logger(refresh.name, 'failed'));
      }
    }

    async function signin(payload: SigninPayload) {
      try {
        const response = await apiAuth.signin(payload);
        setTokens(response.data.result.token);
        setAccount(response.data.result.account);
        // setPermissions(response.data.result.permissions);
        router.push('/');
      } catch (error) {
        throw new Error(logger(signin.name, 'failed'));
      }
    }

    async function signup(payload: SignupPayload) {
      try {
        const response = await apiAuth.signup(payload);
        setTokens(response.data.result.token);
        setAccount(response.data.result.account);
        setPermissions(response.data.result.permissions);
      } catch {
        throw new Error(logger(signup.name, 'failed'));
      }
    }

    async function logout() {
      try {
        await apiAuth.logout(token.value);
        clearTokens();
        clearAccount();
        clearPermissions();
        clearRoutes();
        router.push('/auth/signin');
      } catch (error) {
        throw new Error(logger(logout.name, 'failed'));
      }
    }

    async function findMe() {
      try {
        const response = await apiAuth.findMe();
        setAccount(response.data.result.account);
        setPermissions(response.data.result.permissions);
      } catch (error) {
        throw new Error(logger(findMe.name, 'failed'));
      }
    }

    const isAuthenticated = computed(() => !!token.value.accessToken);

    function updateRoutes(_routes: RouteRecordRaw[]) {
      routes = _routes;
    }
    function clearRoutes() {
      routes = [];
    }

    return {
      /**
       * * state
       */
      // prettier-ignore
      token,
      account,
      permissions,
      isAuthenticated,
      routes,
      /**
       * * actions
       */
      clearTokens,
      signin,
      signup,
      refresh,
      logout,
      findMe,
      updateRoutes,
      clearRoutes
    };
  },
  { persist: true }
);
