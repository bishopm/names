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
      token: null
    },
    mutations: {
      setNow (state, newnow) {
        state.now = newnow
      },
      setToken (state, newtoken) {
        state.token = newtoken
      }
    }
  })

  return store
}
