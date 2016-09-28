"use strict";

let express = require('express');
let fs = require('fs');
let bodyParser = require('body-parser');


let app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.set('Content-Type', 'application/json');
next();
});

app.get('/', (req, res) => {
	res.send('API is running.');
});

app.get('/notes', (req,  res) => {
	fs.readFile(__dirname + '/data/notes.json', (err, data) => {
	if (err) {
		res.status(500).end();
		return console.log(err);
	}
	
	res.status(200).send(data);
});
});

// Update a note

app.put('/notes/:id', (req, res) => {
	fs.readFile(__dirname + '/data/notes.json', 'utf8', (err, data) => {
	
	console.log("putting note!");

if (err) {
	res.status(500).end();
	return console.log(err);
}

try {
	data = JSON.parse(data);
} catch (e) {
	res.status(500).end();
	return console.log(e);
}

data.forEach((note, index) => {
	if (note.id == req.params.id) {
	data[index] = req.body;
}
});

fs.writeFile(__dirname + '/data/notes.json', JSON.stringify(data), (err) => {
	if (err) {
		res.status(500).end();
		return console.log(err);
	}
	
	res.status(200).send(data);
	
});
	
});
	
});

// Create a new note

app.post('/notes', (req, res) => {
	
	fs.readFile(__dirname + '/data/notes.json', 'utf8', (err, data) => {
	
	if (err) {
		res.status(500).end();
	}
	
})
	
});

app.listen(5000, () => {
	console.log('Server started. Open http://localhost:5000 in your browser.');
});