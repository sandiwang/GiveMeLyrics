const errorLogger = {
	generalLogging: (app, env) => {
		console.log('NODE_ENV:', env)

	  if (env === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500)
	        res.render('error', {
	            message: err.message,
	            error: err
	        })
	    })
		} else {
			app.use(function(err, req, res, next) {
		    res.status(err.status || 500)
		    res.render('error', {
		        message: err.message,
		        error: {}
		    })
			})
		}
	}
}

module.exports = errorLogger