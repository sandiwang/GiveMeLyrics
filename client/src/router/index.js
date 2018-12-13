import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'
import { store } from '../store'

const routerOptions = [
  { path: '/', component: 'Landing' },
  { path: '/home', component: 'Home', meta: { requiresAuth: true } },
  { path: '/profile', component: 'Profile', meta: { requiresAuth: true } }
]

const routes = routerOptions.map(route => {
  return {
    path: route.path,
    component: () => import(`@/components/${route.component}.vue`),
    meta: route.meta
  }
})

Vue.use(Router)

const router = new Router({
	mode: 'history',
  routes: [
    ...routes
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
        // , offset: { x: 0, y: 10 }
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 } 
    }
  }
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = (Cookie.get('spotifyAccessToken') === undefined ? false : true) && 
                          (Cookie.get('spotifyRefreshToken') === undefined ? false : true)
  
  if (requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.path === '/' && from.path === '/' && isAuthenticated) {
    next('/home')
  }
  next()
})

export default router