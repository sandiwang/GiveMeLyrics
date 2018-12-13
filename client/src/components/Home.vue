<template>
  <v-container fluid id="home-page">
    <v-layout v-if="!getCurrPlaying" justify-center align-center row wrap>
      <v-flex xs12>
        <div class="white--text display-1">Currently Not Playing Any Song</div>
      </v-flex>
    </v-layout>
    <v-layout v-else justify-center align-center row wrap>
      <v-flex xs12>
        <div class="white--text mt-2 mb-4">
          <div class="display-1 mb-1">{{ getCurrPlaying.name }}</div>
          <div class="title font-weight-light" v-if="getCurrPlaying.artists.length > 0">{{ getCurrPlaying.artists[0].name }}</div>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="white--text" v-if="!getLyrics">No lyrics available</div>
        <div class="white--text" v-else><pre>{{ getLyrics }}</pre></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { spotifyServices } from '../services/spotify'
import { dbService } from '@/services/db'

import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      devices: {},
      userSearchedTrack: {
        id: null
      }
    }
  },
  mounted () {
  },

  computed: {
    ...mapGetters('musixmatch', [
      'getLyrics'
    ]),

    ...mapGetters('spotify', [
      'getIsPlaying',
      'getCurrPlaying'
    ])
  },

  methods: {
    getDevices () {
      return spotifyServices
        .getDevices()
        .then(data => this.devices = data)
    },

    getCurrentPlay () {
      return spotifyServices
        .getCurrentlyPlaying()
        .then(data => data ? data.device.name : null)
    }

  }
}
</script>