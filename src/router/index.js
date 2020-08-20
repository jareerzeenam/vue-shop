import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Admin from "../views/Admin.vue";
import Overview from "../views/Overview.vue";
import Products from "../views/Products.vue";

import TestProducts from "../views/TestProducts.vue";
import Orders from "../views/Orders.vue";
import Profile from "../views/Profile.vue";
import {fb} from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    // ! The below line will check if the user is Authenticted or not
    meta: { requiresAuth: true },
    children: [
      {
        path: "overview",
        name: "overview",
        component: Overview,
      },
      {
        path: "products",
        name: "products",
        component: Products,
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
      },
      {
        path: "test-products",
        name: "test-products",
        component: TestProducts,
      },
      {
        path: "orders",
        name: "orders",
        component: Orders,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = fb.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});


export default router;
