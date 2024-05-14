const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const { json } = require('body-parser')
const PORT = process.env.PORT || 3000;
app.use(express.json());



const notesData = require('./db/db.json')

const nXprsNoteIdGenerator = function () {


    num = (Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1));

    nxprs_id = 'nxprs-' + num

    return nxprs_id
}

// terminal colors for messages
const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
yellow = '\x1b[33m%s\x1b[0m';

// Read note
// retrieve main page
app.get('/', (req, res) => {

    console.log(green, `😀 ${req.method} default routs reached!`)
    res.sendFile(`${__dirname}/public/index.html`)

})

// retrieve notes page
app.get("/notes", (req, res) => {

    console.log(green, `😀 ${req.method} notes accessed`)
    res.sendFile(`${__dirname}/public/notes.html`)
})

// retrieve notes data

app.get('/api/notes', (req, res) => {

    const rawNoteData = fs.readFileSync('./db/db.json', 'utf-8');
    const parsedNotes = JSON.parse(rawNoteData);
    // console.log(rawNoteData);

    res.json(parsedNotes);
});

// create note (post)
app.post('/api/notes', async (req, res) => {
    // send message to console that the route is open 
    console.log(green, `👍 ${req.method} request received to add note`);

    try {
    // deconstruct note entered by the user
    const newNote = req.body;

    // Read the existing notes 
    const rawNoteData = fs.readFileSync('./db/db.json', 'utf-8');
    const notes = JSON.parse(rawNoteData);

    // Add an ID to the new note
    newNote.id = nXprsNoteIdGenerator();

    // Add the new note to the existing notes data
    notes.push(newNote);

    // Write the updated notes to the db.json file
    await fs.promises.writeFile('./db/db.json', JSON.stringify(notes), 'utf-8');
    
    res.json(newNote);
    res.status(201);
    console.log(green, '📝 New Note Successfully storred in database!');

    }
    catch (err) {
        console.log(red, '💀 Failed to write note to database 💀');
        res.status(500);
    }

});




// Delete note

// express functional code
app.use(express.static("public"));
app.use(express.json())

app.listen(PORT, () => {
    console.log(green, `😎 Server is running on port ${PORT}`)
})