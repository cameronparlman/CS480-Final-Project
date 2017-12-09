const SUCCESS = "*File was uploaded";
const ERR_NO_FILE = "*File was NOT uploaded";

const os = require('os');//os.syscall or something like that. basically exec
const express = require('express');
const multer = require('multer');
var path = require('path');
const fs = require("fs");
const app = express();

var watcher;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

var fileAvailable = false;
var returnVideoFilename = "--ERR_NO_VIDEO";

function fileFilter (req, file, cb) {
	if (path.extname(file.originalname).toLowerCase() !== '.avi') {
		console.log("bad file -- doesn't end with .avi", file.originalname);
		return cb(null, false);
	}
	console.log("good file -- ends with .avi");
	cb(null, true);
}

const upload = multer({dest: 'public/uploads/', fileFilter:fileFilter});

app.get('/', (req, res) => {
	res.render('home', { testGreeting: 'Hello world' });
});

app.get('/finishedVideos', function(req, res, next) {
	if (fileAvailable) {
		console.log("video is available");
		res.json( {fileAvailable: fileAvailable, 
							// type: req.file.type, 
							 src: returnVideoFilename});
		returnVideoFilename = "--ERR_NO_VIDEO";
		watcher.close();
		fileAvailable=false;
		// console.log("fileAvailable = " + fileAvailable);
	}
	else {
		// console.log("video not available");
		res.json({fileAvailable: fileAvailable});
	}
});

app.post('/upload', upload.single('video-file'), function(req, res, next) {
	if (!req.file) return next(ERR_NO_FILE);

	watcher = fs.watch("public/finishedVideos", function (event, fileName) {
		console.log("Event: " + event);
		if (event === "rename") {
			console.log("  --file has been added: " + fileName);
			returnVideoFilename = fileName;
			fileAvailable=true;
		}
	});

	res.redirect('/?error=false&message=' + SUCCESS);
});

app.use(function(err, req, res, next) {
	res.redirect('/?error=true&message=' + err);
});

app.listen(3000, () => console.log('Listening on Port 3000.'));