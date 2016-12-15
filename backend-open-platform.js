var express = require('express');
var app = new express();
var route = require('./route');

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'dist');
app.use(express.static('dist'));

route(app);

app.listen(8181);