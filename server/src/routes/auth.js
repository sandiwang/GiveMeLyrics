const jwt = require('jwt-simple')
const request = require('request')
const querystring = require('querystring')
const moment = require('moment')

const config = require('../config')
const utils = require('../utils')

const auth = {
	login: (req, res) => {
		const app = req.params.app
	  const appConfig = config[app]
	  const scope = appConfig.scope
	  const stateKey = appConfig.stateKey
		const state = utils.generateRandomString(16)

	  res.cookie(stateKey, state)

	  const params = querystring.stringify({
	    response_type: 'code',
	    client_id: appConfig.clientId,
	    scope: scope,
	    redirect_uri: appConfig.redirectUri,
	    state: state
	  })

	  res.redirect(`${appConfig.authUrl}?${params}`)
	},

	callback: (req, res) => {
		const app = req.params.app
	  const appConfig = config[app]
	  const code = req.query.code || null
	  const state = req.query.state || null
	  const stateKey = appConfig.stateKey
	  const storedState = req.cookies ? req.cookies[stateKey] : null

	  if (state === null || state !== storedState) {
	    res.redirect('/#' +
	      querystring.stringify({
	        error: 'state_mismatch'
	      }))
	  } else {
	    res.clearCookie(stateKey)

	    const authOptions = {
	      url: appConfig.tokenUrl,
	      form: {
	        code: code,
	        redirect_uri: appConfig.redirectUri,
	        grant_type: 'authorization_code'
	      },
	      headers: {
	        'Authorization': 'Basic ' + (new Buffer(appConfig.clientId + ':' + appConfig.clientSecret).toString('base64'))
	      },
	      json: true
	    }
	    
	    request.post(authOptions, (error, response, body) => {
	      if (!error && response.statusCode === 200) {
	        const access_token = body.access_token
	        const refresh_token = body.refresh_token
	        const expires_in = body.expires_in
	        const expiredTime = moment().add(expires_in, 's').utc()
	        const encodedAccessToken = jwt.encode(access_token, appConfig.clientSecret)
	        const encodedRefreshToken = app === 'spotify' ? jwt.encode(refresh_token, appConfig.clientSecret) : null

	        res.cookie(`${app}AccessToken`, encodedAccessToken)
	        res.cookie(`${app}RefreshToken`, encodedRefreshToken)
	        res.cookie(`${app}TokenExpiresIn`, expires_in)
	        res.cookie(`${app}TokenExpiredTime`, expiredTime)

	        res.redirect('http://localhost:8080')
	      } else {
	        res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`)
	      }
	    })  
	  }
	},

	refreshToken: (req, res) => {
		const app = req.params.app
	  const appConfig = config[app]

	  // requesting access token from refresh token
	  const oldRefreshToken = req.query.token

	  if (!oldRefreshToken) {
	    res.send({ error: 'No refresh token found' })
	    return
	  }

	  const refresh_token = jwt.decode(oldRefreshToken, appConfig.clientSecret)

	  const authOptions = {
	    url: appConfig.tokenUrl,
	    headers: { 'Authorization': 'Basic ' + (new Buffer(appConfig.clientId + ':' + appConfig.clientSecret).toString('base64')) },
	    form: {
	      grant_type: 'refresh_token',
	      refresh_token: refresh_token
	    },
	    json: true
	  }

	  request.post(authOptions, (error, response, body) => {
	    if (error === null && response.statusCode === 200) {
	      const access_token = body.access_token
	      const expires_in = body.expires_in
	      const expiredTime = moment().add(expires_in, 's').utc()
	      const encodedAccessToken = jwt.encode(access_token, appConfig.clientSecret)
	      const encodedRefreshToken = jwt.encode(refresh_token, appConfig.clientSecret)
	      
	      const tokens = {}
	      const now = new Date().toUTCString()
	      tokens[`${app}AccessToken`] = encodedAccessToken
	      tokens[`${app}RefreshToken`] = encodedRefreshToken
	      
	      res.cookie(`${app}AccessToken`, encodedAccessToken, { httpOnly: false })
	      res.cookie(`${app}RefreshToken`, encodedRefreshToken, { httpOnly: false })
	      res.cookie(`${app}TokenExpiredTime`, expiredTime)

	      console.log('\n')
	      console.log('==================================================================')
	      // console.log('Token refresh time:', now)
	      console.log('tokens:')
	      console.log(tokens)
	      console.log('==================================================================')
	      console.log('\n')

	      res.send(tokens)
	      // res.redirect('http://localhost:8080')
	    } else {
	    	res.status(500)
  			res.render('error', { error: err })
	    }
	  })
	}
}

module.exports = auth