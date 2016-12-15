fis.match('::package', {
	postpackager: fis.plugin('loader', {
		allInOne:{
			js: function (file) {
				return "/static/js/" + file.filename + "_aio.js";
			},
			css: function (file) {
				return "/static/css/" + file.filename + "_aio.css";
			}
		}
	})
});

fis.match('::packager', {
	spriter: fis.plugin('csssprites')
});

fis.match('*.{png,js,css}', {
	release: '/$0'
});
fis.match('package.json', {
	release: false
});

fis.match('*.{js,css,png}', {
	useHash: true
});

fis.match('*.js', {
	optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
	useSprite: true,
	optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
	optimizer: fis.plugin('png-compressor')
});

fis.media('debug').match('*.{js,css,png}', {
	useHash: false,
	useSprite: false,
	optimizer: null
});