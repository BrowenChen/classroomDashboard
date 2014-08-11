## Express-Server

A basic expressJS server with my defaults.

* [SASS](http://sass-lang.com/) is the CSS preprocessor
* [Jade](jade-lang.com) is the HTML template engine


### Installing

Run:

	$ npm install
	$ supervisor app <port>

Or (if supervisor is not installed):

	$ node app <port>


### Pushing to Heroku

Assuming [Heroku](http://www.heroku.com/) is fully set up:

	$ heroku apps:create 
	$ git push heroku master