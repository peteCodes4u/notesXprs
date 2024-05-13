// const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const { json } = require('body-parser')
const PORT = process.env.PORT || 3000;



const notesData = require('./db/db.json')


// terminal colors for messages
const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
yellow = '\x1b[33m%s\x1b[0m';

// Read note
// retrieve main page
app.get('/', (req, res) => {

    console.log( green, `😀 default routs reached!`)
    res.sendFile(`${__dirname}/public/index.html`)
   
})

// retrieve notes page
app.get("/notes", (req, res) => {

    console.log(green, `😀 notes accessed`)
    res.sendFile(`${__dirname}/public/notes.html`)
})

// retrieve notes data
app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

// Update note
// Delete note

// express functional code
app.use(express.static("public"));
app.use(express.json())

app.listen(PORT, ()=> {
    console.log(green, `😎 Server is running on port ${PORT}`)
})