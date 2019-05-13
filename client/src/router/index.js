import Vue from 'vue'
import Router from 'vue-router'
import TestSelect from '@/components/TestSelect'
import TakeTest from '@/components/TakeTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'testSelect',
      component: TestSelect
    },
    {
      path: '/test/:id',
      name: 'takeTest',
      component: TakeTest
    },
    {
      path: '*',
      redirect: 'testSelect'
    }
  ]
})
