import { spotifyServices } from '../../services/spotify'

const state = {
  user: null
}

// getters
const getters = {
  getUser: state => state.user,
}

// actions
const actions = {
  getProfile ({commit}) {
    commit('setLoading', true, { root: true })
    return spotifyServices
      .getProfile()
      .then(result => {
        if (result.refreshed === true ) {
          return spotifyServices.getProfile()
        }
        
        commit('setProfile', result.data)
        commit('setLoading', false, { root: true })
      })
  }
}

// mutations
const mutations = {
  resetUsers (state) {
    state.user = null
  },

  setProfile (state, payload) {
    state.user = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}