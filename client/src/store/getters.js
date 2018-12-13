export const getters = {
  getError (state) {
  	return state.error
  },

  getAuthState (state) {
  	return state.authenticated
  },
  
  getLoading (state) {
  	return state.loading
  }
}