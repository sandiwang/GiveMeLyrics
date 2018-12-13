import Cookie from 'js-cookie'
import jwt from 'jwt-simple'
import { spotifySecret } from '../config'
import { store } from '../store'
import { utils } from './utils'

export const spotifyServices = {
	getTokens: () => {
		return [Cookie.get('spotifyAccessToken'), Cookie.get('spotifyRefreshToken')]
	},

	decodeTokens: tokens => {
		return tokens.map(token => jwt.decode(token, spotifySecret))
	},

	getDecodedTokens: () => {
		const encoded = spotifyServices.getTokens()
		return spotifyServices.decodeTokens(encoded)
	},

	updateTokens: tokens => {
		for (let token in tokens) {
			Cookie.set(token, tokens[token])
		}
	},

	handleResponse: (res) => {
		// console.log('handleResponse', res)

		if (res.error && res.error.status === 401) {
			return spotifyServices
				.refreshToken()
				.then(tokens => {
					return { 
						refreshed: true 
					}
				})
		}

		return {
			refreshed: false,
			data: res
		}
	},

	refreshToken: () => {
		const tokens = spotifyServices.getTokens()
	  return fetch(`http://localhost:8081/refreshToken/spotify?token=${tokens[1]}`, {
	  		credentials: 'include'
	  	})
	  	.then(res => res.json())
	  	.catch(error => console.error('Cannot refresh tokens:', error))
	},

	getDevices: () => {
		const tokens = spotifyServices.getDecodedTokens()
		return fetch('https://api.spotify.com/v1/me/player/devices', {
			method: 'get', 
		  headers: new Headers({
		    'Authorization': `Bearer ${tokens[0]}`, 
		    'Content-Type': 'application/x-www-form-urlencoded'
		  })
		})
		.then(res => res.json())
		.then(res => spotifyServices.handleResponse(res))
		.catch(err => console.log(err))
	},

	getCurrentlyPlaying: () => {
		const tokens = spotifyServices.getDecodedTokens()

		return fetch('https://api.spotify.com/v1/me/player', {
				method: 'get', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => utils.errorHanlder(res))
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
	},

	getProfile: () => {
		const tokens = spotifyServices.getDecodedTokens()

		return fetch('https://api.spotify.com/v1/me', {
			method: 'get', 
		  headers: new Headers({
		    'Authorization': `Bearer ${tokens[0]}`, 
		    'Content-Type': 'application/x-www-form-urlencoded'
		  })
		})
		.then(res => utils.errorHanlder(res))
		.then(res => spotifyServices.handleResponse(res))
		.catch(err => console.log('Error when getting profile:', err))
	},

	playback: {
		pause: () => {
			const tokens = spotifyServices.getDecodedTokens()
			return fetch('https://api.spotify.com/v1/me/player/pause', {
				method: 'put', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		resume: (progress, uri) => {
			const tokens = spotifyServices.getDecodedTokens()
			const params = {
				context_uri: uri,
				position_ms: progress
			}
			
			let url = new URL('https://api.spotify.com/v1/me/player/play')
			Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

			return fetch(url, {
				method: 'put', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		toggleShuffle: (state) => {
			const tokens = spotifyServices.getDecodedTokens()
			const url = `https://api.spotify.com/v1/me/player/shuffle?state=${state}`

			return fetch(url, {
				method: 'put', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		playPrevious: () => {
			const tokens = spotifyServices.getDecodedTokens()

			return fetch('https://api.spotify.com/v1/me/player/previous', {
				method: 'post', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		playNext: () => {
			const tokens = spotifyServices.getDecodedTokens()

			return fetch('https://api.spotify.com/v1/me/player/next', {
				method: 'post', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		setRepeat: (state) => {
			const tokens = spotifyServices.getDecodedTokens()
			const url = `https://api.spotify.com/v1/me/player/repeat?state=${state}`

			return fetch(url, {
				method: 'put', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		},

		setVolume: (volume) => {
			const tokens = spotifyServices.getDecodedTokens()
			const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`

			return fetch(url, {
				method: 'put', 
			  headers: new Headers({
			    'Authorization': `Bearer ${tokens[0]}`, 
			    'Content-Type': 'application/x-www-form-urlencoded'
			  })
			})
			.then(res => spotifyServices.handleResponse(res))
			.catch(err => console.log(err))
		}
	}
}