import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false, // can only modify through action
  state: {
    test: null
  },
  mutations: {// from actions
    setTest (state, test) {
      state.test = test
    }
  },
  actions: {// from vue components
    setTest ({commit}, test) {
      commit('setTest', test)
    }
  },
  plugins: [
    createPersistedState({
      getItem: key => Cookies.getJSON(key),
      setItem: (key, value) => Cookies.set(key, value, { expires: 7, secure: true })
    })
  ]
})
