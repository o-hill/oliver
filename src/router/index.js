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
      name: 'Home',
      component: Home,
    },
    {
      path: '/photo/:name',
      name: 'photo',
      component: Photo,
      props: true
    }
  ]
})
