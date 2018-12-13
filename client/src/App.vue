<template>
  <v-app dark>

    <v-layout v-if="isLoading" id="loading-overlay" justify-center align-center>
      <v-progress-circular :size="80" :width="5" indeterminate color="blue-grey lighten-5"></v-progress-circular>
    </v-layout>
    
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue-grey darken-2"
      dark
      app
      fixed
    >
      <v-toolbar-title class="ml-0 pl-0">
        <v-toolbar-side-icon v-if="isAuthenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Lyrics</span>
      </v-toolbar-title>
      <v-text-field
        v-if="isAuthenticated"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down ml-4"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon flat to="/profile">{{ userInitial }}</v-btn>
      <v-btn flat v-if="!spotifyAuth" :href="loginUrlSpotify">
        Log In Spotify
      </v-btn>
    </v-toolbar>

    <v-content class="pt-0">
      <router-view/>
    </v-content>

    <v-footer 
      v-if="spotifyAuth && spotifyCurrPlaying" 
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app 
      fixed 
      height="auto" 
      class="pa-3">
      <v-layout row wrap align-center>

        <v-flex white--text xs3 text-xs-left class="pr-5">
          <v-layout align-center>
            <v-avatar
              tile
              :size="currentlyListeningThumbSize"
              color="grey lighten-4"
            >
              <img :src="currentlyListening.imgUrl" alt="avatar">
            </v-avatar>
            <div class="white--text mx-2">
              <div class="current-song font-weight-bold">{{ currentlyListening.name }}</div>
              <div class="current-artists">
                <span v-for="(artist, i) in currentlyListening.artists" class="grey--text text--lighten-1">{{ artist.name }}<span v-if="i !== currentlyListening.artists.length-1">, </span></span>
              </div>
            </div>
          </v-layout>
        </v-flex>

        <v-flex class="px-1" text-xs-center white--text xs6>
          <v-layout align-center justify-center>
            <div class="playback-container">  
              <div class="playback-actions">
                <v-btn fab icon small flat 
                       :color="playback.shuffle.status === true ? 'green accent-3' : 'grey lighten-1'" 
                       class="my-0 shuffle"
                       @click="playbackAction('shuffle')"
                >
                  <v-icon>{{ playback.shuffle.icon }}</v-icon>
                </v-btn>

                <v-btn fab icon small flat color="grey lighten-1" class="my-0 previous" @click="playbackAction('previous')">
                  <v-icon>{{ playback.previous.icon }}</v-icon>
                </v-btn>

                <v-btn fab icon small flat outline color="white" class="my-0 play" @click="playbackAction('play')">
                  <v-icon>{{ playback.play.icon[playback.play.status] }}</v-icon>
                </v-btn>

                <v-btn fab icon small flat color="grey lighten-1" class="my-0 next" @click="playbackAction('next')">
                  <v-icon>{{ playback.next.icon }}</v-icon>
                </v-btn>

                <v-btn fab icon small flat 
                       :color="playback.repeat.status === 'off' ? 'grey lighten-1' : 'green accent-3'" 
                       class="my-0 repeat"
                       @click="playbackAction('repeat')"
                >
                  <v-icon>{{ playback.repeat.icon[playback.repeat.status] }}</v-icon>
                </v-btn>

                <!--
                <v-btn fab icon small flat 
                  v-for="(action, i) in playbackActionButtons"
                  :key="action.name" 
                  :outline="action.name === 'play'"
                  color="'grey lighten-1" 
                  :class="action.name"
                  class="my-0"
                  @click="playbackAction(action.name)"
                  >
                  <v-icon v-if="playBackButtonState[i] === true">{{ action.icon.on }}</v-icon>
                  <v-icon v-else>{{ action.icon.off }}</v-icon>
                </v-btn>
                -->
              </div>
              <div class="playback-progress">
                <v-layout align-center justify-space-around>
                  <span class="current-playback-duration mr-2">{{ currentlyListening.progress | durationInMinAndSec }}</span>
                  <v-progress-linear color="grey lighten-1" height="5" :value="currentlyListening.progressPercent"></v-progress-linear>
                  <span class="current-song-duration ml-2">{{ currentlyListening.duration | durationInMinAndSec }}</span>
                </v-layout>
              </div>
            </div>
          </v-layout>
        </v-flex>

        <v-flex white--text xs3 text-xs-right class="pl-5">
          <v-layout align-center justify-end>
            <v-btn fab icon small flat color="grey lighten-1" class="mx-0" @click="devicesListDialog=true">
              <v-icon>devices</v-icon>
            </v-btn>

            <div class="volume-slider">
              <v-slider
                v-model="playback.volume"
                :prepend-icon="playback.volume === 0 ? 'volume_mute' : 'volume_down'"
                class="pa-0 ma-0"
                min="0"
                max="100"
                hide-details
                dark
                color="grey lighten-1"
                @click:prepend="toggleMute"
                @change="updateVolume"
              ></v-slider>
            </div>
          </v-layout>
        </v-flex>

        <v-dialog v-model="devicesListDialog" max-width="400px">
          <v-card>

            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <div class="white--text display-1">Devices</div>
                </v-flex>
                <v-flex xs12>
                  <v-list two-line>
                  <template v-for="(device, index) in devices">
                    <v-list-tile
                      :key="device.id"
                      
                    >
                      <v-list-tile-action>
                        <v-icon>{{ device.type.toLowerCase() }}</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title v-html="device.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="device.type"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
                </v-flex>
              </v-layout>
            </v-card-title>

          </v-card>
        </v-dialog>

      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { spotifyServices } from './services/spotify'

let getCurrentPlayingInterval = 'NOT_PLAYING'

export default {
  name: 'App',
  data () {
    return {
      dialog: false,
      drawer: false,
      loginUrlSpotify: `http://localhost:8081/login/spotify`,
      playback: {
        shuffle: {
          icon: 'shuffle',
          status: false
        },
        previous: {
          icon: 'skip_previous'
        },
        play: {
          icon: {
            false: 'play_arrow',
            true: 'pause'
          },
          status: false
        },
        next: {
          icon: 'skip_next'
        },
        repeat: {
          icon: {
            off: 'repeat',
            context: 'repeat',
            track: 'repeat_one'
          },
          states: ['off', 'context', 'track'],
          status: 'off'
        },
        volume: null,
        prevVolume: 0
      },
      currentlyListeningThumbSize: '60px',
      // isCurrentlyListening indicates if user was playing songs at the time we land this page
      // whereas currentlyListening.isPlaying is used when user toggle play/pause in the app
      isCurrentlyListening: false,
      currentlyListening: {},
      devicesListDialog: false,
      devices: null,
    }
  },
  mounted () {
    this.getCurrentlyPlaying()
    this.getDevices()
  },
  watch: {
    
  },

  filters: {
    durationInMinAndSec (duration_ms) {
      const min = Math.floor(duration_ms / 1000 / 60)
      const sec = Math.round(duration_ms / 1000 % 60)
      return `${min}:${sec.toLocaleString('en-US', { 
        minimumIntegerDigits: 2, useGrouping: false}
        )}`
    }
  },

  computed: {
    ...mapGetters("users", [
      'getUser'
    ]),

    ...mapGetters({
      spotifyAuth: 'spotify/getAuth',
      isPlaying: 'spotify/getIsPlaying',
      spotifyCurrPlaying: 'spotify/getCurrPlaying'
    }),

    isLoading () {
      return this.$store.getters.getLoading
    },

    isAuthenticated () {
      return this.$store.getters.getAuthState
    },

    userInitial () {
      return this.getUser ? this.getInitial(this.getUser.display_name) : ''
    },

    menuItems () {
      if(this.isAuthenticated) {
        return [
          { title: 'Home', path: '/home', icon: 'home'},
          { title: 'Spendings', path: '/spendings', icon: 'show_chart' }
        ]
      } else {
        return [
          { title: 'Home', path: '/' }
        ]
      }
    }
  },

  methods: {
    startPlaybackInterval () {
      getCurrentPlayingInterval = setInterval(this.getCurrentlyPlaying, 2000)
    },
    stopPlaybackInterval () {
      clearInterval(getCurrentPlayingInterval)
      getCurrentPlayingInterval = 'NOT_PLAYING'
    },

    getInitial: (name) => name.split(" ").map(n => n.slice(0,1)).join().replace(",", ""),

    getCurrentlyPlaying () {
      return spotifyServices
        .getCurrentlyPlaying()
        .then(result => {
          if (!result.data) {
            this.isCurrentlyListening = false
          } else {
            this.isCurrentlyListening = true

            const isPlaying = result.data.is_playing
            const shuffle = result.data.shuffle_state
            const repeat = result.data.repeat_state
            const item = result.data.item
            const name = item.name
            const artists = item.artists
            const uri = item.uri
            const images = item.album.images
            const duration = item.duration_ms
            const progress = result.data.progress_ms
            const progressPercent = result.data.progress_ms / item.duration_ms * 100
            const volume = result.data.device['volume_percent']

            console.log(result.data)

            if (result) {
              this.currentlyListening = Object.assign({}, {
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
              })

              this.playback.play.status = isPlaying
              this.playback.shuffle.status = shuffle
              this.playback.repeat.status = repeat
              this.playback.volume = volume
            }

            if (isPlaying === true && getCurrentPlayingInterval === 'NOT_PLAYING') {
              this.startPlaybackInterval()


            } else if (isPlaying === false) {

            }
          }
        })
    },

    playbackAction (action) {
      switch (action) {
        case 'play':
          this.togglePlayback()
          break

        case 'shuffle':
          this.toggleShuffle()
          break

        case 'previous':
          this.playPrevious()
          break

        case 'next':
          this.playNext()
          break

        case 'repeat':
          this.setRepeat()
          break
      }
    },

    togglePlayback () {
      console.log('playback toggle')
      // resume playback
      if (getCurrentPlayingInterval === 'NOT_PLAYING') {
        return spotifyServices.playback.resume(this.currentlyListening.progress, this.currentlyListening.uri)
          .then(() => {
            console.log('successfully resume user playback')
            this.playback.play.status = true
            this.startPlaybackInterval()
          })
      // pause playback
      } else {        
        return spotifyServices.playback.pause()
          .then(() => {
            console.log('successfully pause user playback')
            this.playback.play.status = false
            this.stopPlaybackInterval()
          })
      }
    },

    toggleShuffle () {
      this.playback.shuffle.status = !this.playback.shuffle.status

      const state = this.playback.shuffle.status

      return spotifyServices.playback.toggleShuffle(state)
        .then(() => {
          console.log('toggled shuffle state, current state:', state)
        })
    },

    playPrevious () {
      return spotifyServices.playback.playPrevious()
        .then(() => {
          console.log('skip to play previous track')
        })
    },

    playNext () {
      return spotifyServices.playback.playNext()
        .then(() => {
          console.log('skip to play next track')
        })
    },

    setRepeat () {
      const prevState = this.playback.repeat.states.indexOf(this.playback.repeat.status)
      const currState = prevState === (this.playback.repeat.states.length-1) ? 0 : prevState + 1
      const state = this.playback.repeat.states[currState]

      return spotifyServices.playback.setRepeat(state)
        .then(() => {
          console.log('successfully set repeat')
          this.playback.repeat.status = this.playback.repeat.states[currState]
        })
    },

    getDevices () {
      return spotifyServices.getDevices()
        .then(result => {
          // devices is type of Array
          const devices = result.data.devices
          this.devices = devices
        })
    },

    toggleMute () {
      const currVolume = this.playback.volume

      if (currVolume === 0) {
        // recover to original volume
        this.playback.volume = this.playback.prevVolume
        this.playback.prevVolume = 0
      } else {
        // mute
        this.playback.prevVolume = currVolume
        this.playback.volume = 0
      }

      return spotifyServices.playback.setVolume(this.playback.volume)
        .then(() => {
          console.log(`successfully set volume at ${this.playback.volume}`)
        })
    },

    updateVolume () {
      return spotifyServices.playback.setVolume(this.playback.volume)
        .then(() => {
          console.log(`successfully set volume at ${this.playback.volume}`)
        })
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#loading-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #37474F;
  z-index: 99999;
}

.current-song {
  width: 100%;
  overflow: hidden;
}

.current-artists {
  width: 100%;
  overflow: hidden;
  height: 1.5em;
  position: relative;
}

.volume-slider {
  width: 150px;
}

footer .v-btn--active:before, 
footer .v-btn:focus:before, 
footer .v-btn:hover:before {
  background-color: transparent;
}

footer .v-btn:hover .v-icon {
  color: #fff;
}
</style>
