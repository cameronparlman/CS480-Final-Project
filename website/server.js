const express = require('express');
const multer = require('multer');
var path = require('path')

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

function fileFilter (req, file, cb) {
	if (path.extname(file.originalname) !== '.mp4') {
		console.log("good file -- ends with .mp4");
		return cb(null, false);
	}
	console.log("bad file -- doesn't end with .mp4");
	cb(null, true);
}

const upload = multer({dest: 'uploads/', fileFilter:fileFilter});

app.get('/', (req, res) => {
	res.render('home', { testGreeting: 'Hello world' });
});

app.post('/upload', upload.single('video-file'), function(req, res) {
 	console.log(req.file);
 	console.log(req.params);
 	if (req.file) {
	    console.log("successfully received");
	    return res.send({success: "success"});
	}
	console.log("received wrong file");
	return res.end();
});

app.listen(3000, () => console.log('Listening on Port 3000.'));

//websocket javascript
//setinterval thread, poll 
//javascript nad jquery to updatemarkup 