"use strict";

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
	

let app = express();
let dataPath = '/data/notes.json';

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.set('Content-Type', 'application/json');
	next();
});

// Utilties

let logSendError = (res, err) => {
	res.status(500).end();
	return console.log(err);
};

let readDataAsync = () => {
	return new Promise((resolve, reject)  => {
		fs.readFile(path.join(__dirname, dataPath), 'utf8', (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		});
	})
};

let writeSendData = (res, data) => {
	writeDataAsync(data).then((data) => {
		res.status(200).send(data);
	}).catch((err) => {
		logSendError(res, err);
	});
};

let writeDataAsync = (data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path.join(__dirname, dataPath), JSON.stringify(data), (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	})
};
	
	
// Routes

app.get('/', (req, res) => {
	res.send('API is running.');
});

app.get('/notes', (req,  res) => {
	
	readDataAsync().
		then((data) => {
			res.status(200).send(data);
	}).
		catch((err) => {
			logSendError(res, err);
	});
	
});

// Update a note

app.put('/notes/:id', (req, res) => {
	
	readDataAsync().
		then((data) => {
		
			let match = false;
			
			try {
				data = JSON.parse(data);
			} catch (e) {
				logSendError(res, e);
			}
		
			data.forEach((note, index) => {
				if (note.id == req.params.id) {
					data[index] = req.body;
					match = true;
				}
			});
		
			if (!match) {
				logSendError(res, "No existing note found to be updated.");
			}
			
			writeSendData(res,  data);
		
	}).
		catch((err) => {
		logSendError(res,  err);
	});
});

// Create a new note

app.post('/notes', (req, res) => {
	
	readDataAsync().then((data) => {
		
		try {
			data = JSON.parse(data);
		} catch (e) {
			logSendError(res, e);
		}
		
		data.push(req.body);
		
		writeSendData(res, data);
		
	}).catch((err) => {
		logSendError(res, err);
	});
});

// Delete an existing note

app.delete('/notes/:id', (req, res) => {
	
	readDataAsync().then((data) => {
		
		try {
			data = JSON.parse(data);
		} catch (e) {
			logSendError(res, e);
		}
		
		let index = -1;
		
		console.log(req.params.id);
		
		data.forEach((note, i) => {
			if (Number(note.id) === Number(req.params.id)) {
				index = i;
			}
		});
		
		
		if (index > -1) {
			data.splice(index,  1);
		}
		
		writeSendData(res, data);
		
	}).catch((err) => {
		logSendError(res, err);
	});
	
});

app.listen(5000, () => {
	console.log('Server started. Open http://localhost:5000 in your browser.');
});