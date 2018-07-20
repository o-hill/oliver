import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Transitioner from '@/components/Pages'
import Photo from '@/components/Photo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gateway',
      component: Transitioner
    },
    {
      path: '/:originalRequest',
      name: 'Home',
      component: Home,
      props: true
    },
    {
      path: '/photo/:name',
      name: 'photo',
      component: Photo,
      props: true
    }
  ]
})
