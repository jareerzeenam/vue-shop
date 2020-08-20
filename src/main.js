import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { fb } from "./firebase";
import VueFirestore from "vue-firestore";

require("firebase/firestore");

Vue.use(VueFirestore, {
  key: "id", // the name of the property. Default is '.key'.
  enumerable: true, //  whether it is enumerable or not. Default is true.
});

Vue.use(VueFirestore);

// !imports
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import "popper.js";
import "bootstrap";
import "./assets/app.scss";

// ! Sweet Allert
import Swal from "sweetalert2";
window.Swal = Swal;
// * sweet alert toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
window.Toast = Toast;

// ! Import  Globally
Vue.component("Navbar", require("./components/Navbar.vue").default);
Vue.component("products-list", require("./sections/ProductList.vue").default);

// ! vie corousal

import VueCarousel from "vue-carousel";
Vue.use(VueCarousel);
// !

// ! Vue Filter

import Vue2Filters from "vue2-filters";

Vue.use(Vue2Filters);
// !

Vue.config.productionTip = false;

// ! Authentication

let app = "";
fb.auth().onAuthStateChanged(function(user) {
  if (!app) {
    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
