import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// !imports
import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import "popper.js";
import "bootstrap";
import "./assets/app.scss";

// ! Import Navbar Globally
Vue.component("Navbar", require("./components/Navbar.vue").default);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
