export const utils = {
	errorHanlder: (res) => {
		// console.log(`ok: ${ res.ok }, status: ${ res.status }, statusText: ${ res.statusText }`)

		if (!res.ok) {
			return res.json()
		} else if (res.status === 204) {
			return null
		} else {
			return res.json()
		}

	}
}