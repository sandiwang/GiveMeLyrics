import { dbService } from '../../services/db'

const state = {
  trackId: null,
  lyricsInfo: {},
  lyrics: null,
}

// getters
const getters = {
  getTrackId: state => state.trackId,
  getLyrics: state => state.lyrics,
  getLyricsInfo: state => state.lyricsInfo
}

// actions
const actions = {
  getTrackId: ({commit}, payload) => {
    const track = payload.track
    const artist = payload.artist

    return dbService
      .searchTrack(track, artist)
      .then(data => {
        const available = data.message.header.available

        if (available === 0) {
          commit('setTrackId', -1)
        } else {
          // we always get the first result
          const id = data.message.body.track_list[0].track.lyrics_id
          commit('setTrackId', id)
        }
      })
  },

  getLyrics: ({commit}, payload) => {
    const track = payload.track
    const artist = payload.artist

    return dbService
      .getLyrics(track, artist)
      .then(data => {
        const lyrics = data.message.body.lyrics
        if(!lyrics) {
          commit('setLyrics', null)
        } else {
          commit('setLyrics', lyrics.lyrics_body)
        }
        commit('setLyricsInfo', lyrics)
      })
  }
}

// mutations
const mutations = {
  setTrackId (state, payload) {
    state.trackId = payload
  },

  setLyrics (state, payload) {
    state.lyrics = payload
  },

  setLyricsInfo (state, payload) {
    state.lyricsInfo = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}