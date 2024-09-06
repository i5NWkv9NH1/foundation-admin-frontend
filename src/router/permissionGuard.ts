import { whiteList } from '@/constants'
import router from '@/router'
import { useAuthStore, usePermissionStore } from '@/stores'
import { isEmpty } from 'lodash'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const pages = import.meta.glob('../pages/**/**.vue')
const layouts = import.meta.glob('../layouts/**.vue')

export async function initializePermissions() {
  const authStore = useAuthStore()
  const permissionStore = usePermissionStore()
  const hasLoadedRoutes = computed(() => !isEmpty(permissionStore.permissions.routes))
  // const hasActions = computed(() => !isEmpty(permissionStore.permissions.actions))

  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    //*
    const title = import.meta.env.VITE_WEB_TITLE;
    document.title = to.meta.title || title;

    //*
    if (to.path === '/auth/signin') {
      //*
      if (authStore.isAuthenticated) {
        return next(from.fullPath)
      } else {
        console.log('expire')
      }
      //*
      resetRouter()
      return next()
    }

    //*
    if (whiteList.includes(to.path)) return next()
    //*
    if (!authStore.isAuthenticated) return next({ path: '/auth/signin', replace: true })
    //*
    if (!hasLoadedRoutes.value) {
      try {
        await authStore.findMe()
        const routes = convertToVueRoutes(permissionStore.permissions.routes)
        routes.forEach((route: any) => {
          router.addRoute(route)
        })
      } catch {
        resetRouter()
        redirectToSignIn(to, next)
      }
      return next({ ...to, replace: true })
    }
    //*
    next()
  })

  router.afterEach(() => {
    NProgress.done();
  })
}

function redirectToSignIn(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const queryParams = new URLSearchParams(to.query as Record<string, string>)
  const queryString = queryParams.toString()
  const redirectPath = queryString ? `${to.path}?${queryString}` : to.path
  next(`/auth/signin?redirect=${encodeURIComponent(redirectPath)}`)
}

function convertToVueRoutes(backEndRoutes: any) {
  return backEndRoutes.map((route: any) => {
    const isParent = !!!route.parentId
    return {
      path: route.path,
      name: route.name,
      // component: isParent ? layouts[`../layouts/${route.components}.vue`] : pages[`../pages/system/${route.component}/index.vue`],
      component: isParent ? layouts[`../layouts/AdminLayout.vue`] : pages[`../pages/system/${route.component}/index.vue`],
      meta: route.meta,
      children: route.children ? convertToVueRoutes(route.children) : [],
      redirect: route.redirect || undefined
    }
  })
}

export const resetRouter = () => {
  const permissionStore = usePermissionStore()
  permissionStore.permissions.routes.forEach((route: any) => {
    const { name } = route
    if (name && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}
