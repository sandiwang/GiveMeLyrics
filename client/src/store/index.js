import Vue from 'vue'
import Vuex from 'vuex'

import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

import users from './modules/users'
import spotify from './modules/spotify'
import musixmatch from './modules/musixmatch'

Vue.use(Vuex)

export const store = new Vuex.Store({
	modules: {
		users,
		spotify,
		musixmatch
  },
  state,
  mutations,
  actions,
  getters
})