import fetch from 'node-fetch'

const url = 'http://localhost:8081'

export const dbService = {
	searchTrack: (track, artist) => fetch(`${url}/track?track=${track}&artist=${artist}`).then(res => res.json()),
	getLyrics: (track, artist) => fetch(`${url}/lyrics?track=${track}&artist=${artist}`).then(res => res.json())
}