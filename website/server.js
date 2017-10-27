const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('home', { testGreeting: 'Hello world' });
});

app.listen(3000, () => console.log('Listening on Port 3000.'));