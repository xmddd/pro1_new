import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Home from '../views/Home.vue'
// import Graph from '../views/Graph.vue'
import MyTest from '../views/MyTest.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // {
  //   path: '/graph',
  //   name: 'graph',
  //   component: Graph
  // },
  {
    path: '/test',
    name: 'mytest',
    component: MyTest
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/paper',
    name: 'paper',
    component: () => import('../views/paper.vue')
  },
  {
    path: '/kg/project-feasibility',
    name: 'project-feasibility',
    component: () => import(/* webpackChunkName: "about" */ '../views/project-feasibility.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
