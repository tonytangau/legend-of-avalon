import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.js';

import App from './App';
import Welcome from './components/Welcome';
import Chat from './components/Chat';

Vue.use(Vuex);
Vue.use(VueRouter);

const state = {
  socket: io()
};
const mutations = {};
const actions = {};
const getters = {}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
  ]
});

new Vue({
  store,
  router,
  template: '<App />',
  components: { App }
}).$mount('#app');