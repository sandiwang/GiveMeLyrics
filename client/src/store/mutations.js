export const mutations = {
	setError (state, payload) {
		state.error = payload
	},

	setAuthState (state, payload) {
		state.authenticated = payload
	},

	setLoading (state, payload) {
		state.loading = payload
	}
}