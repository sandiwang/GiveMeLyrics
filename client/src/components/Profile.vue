<template>
  <v-container fluid>
    <v-layout justify-center align-center row wrap>
      <v-flex xs6 class="text-xs-left">
        <div v-if="getUser" class="white--text mt-2 mb-4">
          <div class="display-1 mb-1">
            <v-avatar size="60" color="white" class="user-avatar mr-3">
              <img :src="getUser.images[0].url" alt="avatar">
            </v-avatar>
            {{ getUser.display_name }}
          </div>

          <v-list two-line subheader class="my-4">
            <v-subheader class="account-type">{{ getUser.product }}</v-subheader>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ getUser.email }}</v-list-tile-title>
                <v-list-tile-sub-title>Email</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ getUser.country }}</v-list-tile-title>
                <v-list-tile-sub-title>Country</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { dbService } from '@/services/db'

export default {
  name: 'Profile',
  data () {
    return {
    }
  },

  mounted () {
    this.getPosts()
  },

  computed: {
    ...mapGetters("users", [
      'getUser'
    ])
  },

  methods: {
    async getPosts () {
      const response = await dbService.fetchPosts()
      this.posts = response
    }
  }
}
</script>

<style>
.account-type {
  text-transform: capitalize;
}
</style>