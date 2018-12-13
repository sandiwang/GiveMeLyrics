// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import Cookie from 'js-cookie'
import App from './App'
import router from './router'
import { store } from './store'
import { spotifyServices } from './services/spotify'

import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    const isAuthenticated = (Cookie.get('spotifyAccessToken') === undefined ? false : true) && 
                            (Cookie.get('spotifyRefreshToken') === undefined ? false : true)
    const spotifyTokenExpiresIn = Cookie.get('spotifyTokenExpiresIn')

  	if (!isAuthenticated) {
      console.log('User is not authenticated. No cookies found.')
      return
    }

    console.log('User is authenticated.')
    store.dispatch('setLoading', true)

    store
      .dispatch('spotify/refreshToken')
      .then(() => {
        store.dispatch('spotify/setAuth', true)
        store.dispatch('spotify/setTokenExpireTime', spotifyTokenExpiresIn)
        store.dispatch('users/getProfile')
        return store.dispatch('spotify/getCurrPlaying')
      })
      .then(() => {
        const curr = store.getters['spotify/getCurrPlaying']
        const track = curr.name
        const artist = curr.artists.length > 0 ? curr.artists[0].name : null
        
        store.dispatch('musixmatch/getLyrics', {
          artist,
          track
        })

        store.dispatch('setLoading', false)
      })

    /*
    store.dispatch('spotify/getCurrentlyListening', spotifyTokens[0])
      .then(() => {
        const currentSong = store.getters['spotify/getCurrentlyListening']
        const isPlayingInSpotify = store.getters['spotify/isPlayingInSpotify']

        if (!isPlayingInSpotify) {
          store.dispatch('setLoading', false)
        } else {
          const track = currentSong.name
          const artist = currentSong.artists.length > 0 ? currentSong.artists[0].name : null
          store
            .dispatch('musixmatch/getLyrics', {
              artist,
              track
            })
            .then(() => store.dispatch('setLoading', false))
        }
      })
    */

  }
})


/*
const unsubscribe = firebase.auth()
	.onAuthStateChanged((firebaseUser) => {
		new Vue({
		  el: '#app',
		  router,
		  store,
		  template: '<App/>',
		  components: { App },
		  created () {
		  	let spendingsTask, depositTask, profileTask, billTask

		  	store.dispatch('setLoading', true)
		  	store.dispatch('autoSignin', firebaseUser)
		  	
		  	if(firebaseUser) {

		  		// initiate notifications
				  notifications.init(firebaseUser.uid)
				  notifications.addEventOnTokenRefresh()
				  notifications.addEventOnMessage(store)

				  // get user data from database
		  		spendingsTask = store.dispatch('spendings/getSpendings', firebaseUser)		  		
			  	depositTask = store.dispatch('deposit/getDeposits', firebaseUser)
			  	billTask = store.dispatch('bills/getBills', firebaseUser)
			  	profileTask= store.dispatch('users/getUserProfile', firebaseUser.uid)

			  	Promise.all([spendingsTask, depositTask, billTask, profileTask])
				  	.then(() => store.dispatch('setLoading', false))
		  	}
		  }
		})
		unsubscribe()
	})
*/
