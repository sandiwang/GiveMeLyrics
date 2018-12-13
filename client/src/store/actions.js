import router from '@/router'

export const actions = {
	setLoading ({commit}, payload) {
		commit('setLoading', payload)
	},

	setAuthState ({commit}, payload) {
		commit('setAuthState', payload)
	},

	userSignout ({commit}) {
		/*
		firebase.auth().signOut()

		// reset state
		commit('setUser', null)		
		commit('bills/resetBills')
		commit('deposit/resetDeposit')
		commit('spendings/resetSpendings')
		commit('users/resetUsers')

		router.push('/')
		*/
	}
}