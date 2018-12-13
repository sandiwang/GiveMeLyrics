const request = require('request')

const config = require('../config')

const lyrics = {
	getTrack: (req, res) => {
	  const musixmatch = config.musixmatch
	  const artist = req.query.artist ? encodeURIComponent(req.query.artist) : null
	  const track =req.query.track ? encodeURIComponent(req.query.track) : null
	  let requestUrl = `${musixmatch.url}/track.search?apikey=${musixmatch.apiKey}`

	  if (track) {
	    requestUrl += `&q_track=${track}`
	  }

	  if (artist) {
	    requestUrl += `&q_artist=${artist}`
	  }

	  request.get(requestUrl, (error, response, body) => {
	      if (error || response.statusCode !== 200) {
	        console.log('ERROR:', error)
	      } else {
	        res.send(JSON.parse(body))
	      }
	    }
	  )
	},

	getLyrics: (req, res) => {
	  const musixmatch = config.musixmatch
	  const artist = req.query.artist ? encodeURIComponent(req.query.artist) : null
	  const track =req.query.track ? encodeURIComponent(req.query.track) : null
	  let requestUrl = `${musixmatch.url}/matcher.lyrics.get?apikey=${musixmatch.apiKey}`

	  if (track) {
	    requestUrl += `&q_track=${track}`
	  }

	  if (artist) {
	    requestUrl += `&q_artist=${artist}`
	  }

	  if (!track && !artist) {
	    console.log('ERROR: No track nor artist provided.')
	    res.send(JSON.parse({ error: 'No track nor artist provided.' }))
	  } else {
	    request.get(requestUrl, (error, response, body) => {
	      if (error || response.statusCode !== 200) {
	        console.log('ERROR:', error)
	      } else {
	        res.send(JSON.parse(body))
	      }
	    })
	  }
	}
}

module.exports = lyrics