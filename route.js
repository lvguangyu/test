module.exports = function(app) {
	app.get('/gamive', function(req, res) {
		res.render('gamive');
	});
	app.get('/ifunny', function(req, res) {
		res.render('ifunny');
	});
	app.get('/map', function(req, res) {
		res.render('map');
	});
	app.get('/reddit', function(req, res) {
		res.render('reddit');
	});
	app.get('/trendingV', function(req, res) {
		res.render('trendingV');
	});
	app.get('/trendingVPlay/:title/:id/:imgUrl', function(req, res) {

		res.render('trendingVPlay',{title:req.params.title , id : req.params.id, imgUrl : req.params.imgUrl});
	});
	app.get('/wiki', function(req, res) {
		res.render('wiki');
	});
	app.get('/yahooWeather', function(req, res) {
		res.render('yahooWeather');
	});

}