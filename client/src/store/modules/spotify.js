import moment from 'moment'

import { spotifyServices } from '../../services/spotify'

const state = {
  auth: false,
  tokenExpiresAt: null,
  isPlaying: false,
  currPlaying: null
}

// getters
const getters = {
  getAuth: state => state.auth,
  getTokenExpireAt: state => state.getTokenExpireAt,
  getIsPlaying: state => state.isPlaying,
  getCurrPlaying: state => state.currPlaying
}

// actions
const actions = {
  setAuth: ({commit}, payload) => commit('setAuth', payload),
  setAccessToken: ({commit}, payload) => commit('setAccessToken', payload),
  setTokenExpireTime: ({commit}, payload) => commit('setTokenExpireTime', payload),

  refreshToken: ({commit, rootState}) => {
    return spotifyServices.refreshToken()
      .then(tokens => {
      })
  },

  getCurrPlaying: ({commit, rootState}) => {
    return spotifyServices
      .getCurrentlyPlaying()
      .then(result => {
        const isPlaying = result.data.is_playing
        const shuffle = result.data.shuffle_state
        const repeat = result.data.repeat_state
        const item = result.data.item
        const name = item.name
        const artists = item.artists
        const images = item.album.images
        const uri = item.uri
        const duration = item.duration_ms
        const progress = result.data.progress_ms
        const progressPercent = result.data.progress_ms / item.duration_ms * 100

        const currentlyListening = {
          isPlaying,
          shuffle,
          repeat,
          name,
          artists,
          uri,
          duration,
          progress,
          progressPercent,
          imgUrl: images.length > 0 ? images[images.length-1].url : null,
        }
        commit('setCurrPlaying', currentlyListening)
        
        if (!result.data.is_playing) {
          commit('setIsPlaying', false)
        } else {
          commit('setIsPlaying', true)
        }
      })
  }
}

// mutations
const mutations = {
  resetAccessToken (state) {
    state.accessToken = null
  },

  setAuth (state, payload) {
    state.auth = payload
  },

  setTokenExpireTime (state, payload) {
    state.tokenExpiresAt = moment().add(payload, 'seconds').toString()
  },

  setIsPlaying (state, payload) {
    state.isPlaying = payload
  },

  setCurrPlaying (state, payload) {
    state.currPlaying = payload
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}