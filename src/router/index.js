import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Transitioner from '@/components/Pages'
import Photo from '@/components/Photo'
import Art from '@/components/Art'
import PhotoView from '@/components/PhotoView'
import Loader from '@/components/Loading'
import Resume from '@/components/Resume'
import Projects from '@/components/Projects'
import Thoughts from '@/components/Thoughts'

import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/art',
      name: 'Art',
      component: Art
    },
    {
      path: '/photo',
      name: 'photo',
      component: Photo
    },
    {
      path: '/loading',
      name: 'loading',
      component: Loader
    },
    {
      path: '/resume',
      name: 'resume',
      component: Resume
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/thought',
      name: 'Thoughts',
      component: Test
    }
  ]
})
