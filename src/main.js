// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import 'babel-polyfill';
import Vue from 'vue';
//import App from './App';
import App from './typressMain.vue';
import router from './router';
// import axios from 'axios';
import ElementUI from 'element-ui';
import iView from 'iview';
import 'element-ui/lib/theme-default/index.css';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:h => h(App)
});

