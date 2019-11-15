const express 		= require('express');
const bodyParser	= require('body-parser');
const PORT 				= process.env.PORT || 3000;
const app     		= express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index');
});

app.listen(PORT, () => {
	console.log(`Application is running at http://localhost:${PORT}`);
});
