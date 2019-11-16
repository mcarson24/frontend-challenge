const express 		= require('express');
const bodyParser	= require('body-parser');
const app     		= express();
const PORT 				= 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.listen(PORT, () => {
	console.log(`Application is running at http://localhost:${PORT}`);
});
