import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const store = new Vuex.Store({
    state: {
      token: null,
      now: '',
      service: ''
    },
    mutations: {
      setNow (state, newnow) {
        state.now = newnow
      },
      setToken (state, newtoken) {
        state.token = newtoken
      },
      setService (state, newservice) {
        state.service = newservice
      }
    }
  })

  return store
}
