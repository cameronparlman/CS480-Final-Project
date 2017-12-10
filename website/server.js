const SUCCESS = "*File was uploaded";
const ERR_NO_FILE = "*File was NOT uploaded";

const os = require('os');
const express = require('express');
const multer = require('multer');
var path = require('path');
const fs = require("fs"); //for filesystem.watcher
const app = express();

var watcher;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

var fileAvailable = false;
var returnVideoFilename = "--ERR_NO_VIDEO"; //default value if some error happens

//makes sure the file is an avi file, otherwise it continues operating on the file
function fileFilter (req, file, cb) {
	if (path.extname(file.originalname).toLowerCase() !== '.avi') {
		//bad file - should be an avi file
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
	//called when client pings the server for a complete video
	if (fileAvailable) {
		//file has been processed and returned to the "finishedVideos" folder
		console.log("video is available");

		//send json object
		res.json( {fileAvailable: fileAvailable,  // is the file available to play?
							 src: returnVideoFilename});// video filename, so client knows which URL to call
		returnVideoFilename = "--ERR_NO_VIDEO"; //return to default value
		watcher.close(); //video sent back to client, don't have to watch the folder for new videos anymore 
		fileAvailable=false; //no new video to send back
		// console.log("fileAvailable = " + fileAvailable);
	}
	else {
		// console.log("video not available");
		//file not available yet, send back that file is not available
		res.json({fileAvailable: fileAvailable});
	}
});

app.post('/upload', upload.single('video-file'), function(req, res, next) {
	//if file is not clean (fileFilter rejected the file), continue to next function
	if (!req.file) return next(ERR_NO_FILE);

	//if file was accepted by fileFilter, create a watcher that waits for the
	// processed video to be sent back
	watcher = fs.watch("public/finishedVideos", function (event, fileName) {
		console.log("Event: " + event); // will say "rename" if a new file is created
		if (event === "rename") {
			console.log("  --file has been added: " + fileName);
			returnVideoFilename = fileName; //set filename because there is a video available
			fileAvailable=true;//file is available to send beck
		}
	});

	res.redirect('/?error=false&message=' + SUCCESS);
	// redirect webpage let client know that file was accepted
});

app.use(function(err, req, res, next) {
	//error, let client know that file was not accepted by filter
	res.redirect('/?error=true&message=' + err);
});

app.listen(3000, () => console.log('Listening on Port 3000.'));