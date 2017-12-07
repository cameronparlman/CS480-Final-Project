const SUCCESS = "*File was uploaded";
const ERR_NO_FILE = "*File was NOT uploaded";

const express = require('express');
const multer = require('multer');
var path = require('path')

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

function fileFilter (req, file, cb) {
	if (path.extname(file.originalname).toLowerCase() !== '.avi') {
		// console.log("bad file -- doesn't end with .avi", file.originalname);
		return cb(null, false);
	}
	// console.log("good file -- ends with .avi");
	cb(null, true);
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})

const upload = multer({dest: 'public/uploads/', fileFilter:fileFilter, storage:storage});

app.get('/', (req, res) => {
	res.render('home', { testGreeting: 'Hello world' });
});

app.get('/finishedVideos', function(req, res) {
	var fs = require('fs');
	var files = fs.readdirSync('/finishedVideos');
	console.log(location.host + files[0]);
	res.send(location.host + files[0]);
});

app.post('/upload', upload.single('video-file'), function(req, res, next) {
	if (!req.file) return next(ERR_NO_FILE);
	res.redirect('/?error=false&message=' + SUCCESS);
});

app.post('/upload', upload.single('video-file'), function(req, res, next) {
	if (!req.file) return next(ERR_NO_FILE);
	res.redirect('/?error=false&message=' + SUCCESS);
});

app.use(function(err, req, res, next) {
	res.redirect('/?error=true&message=' + err);
});

app.listen(3000, () => console.log('Listening on Port 3000.'));