const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const { json } = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use(express.json());



const notesData = require('./db/db.json')

const nXprsNoteIdGenerator = function () {


    num = (Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1));

    nxprs_id = 'nxprs-' + num

    return nxprs_id
};

// terminal colors for messages
const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';

// Read note
// retrieve main page
app.get('/', (req, res) => {

    console.log(green, `😀 ${req.method} default routs reached!`);
    res.sendFile(`${__dirname}/public/index.html`);
    res.status(200);

});

// retrieve notes page
app.get("/notes", (req, res) => {

    console.log(green, `😀 ${req.method} notes accessed`);
    res.sendFile(`${__dirname}/public/notes.html`);
    res.status(200);
});

// retrieve notes data

app.get('/api/notes', (req, res) => {

    const rawNoteData = fs.readFileSync('./db/db.json', 'utf-8');
    const parsedNotes = JSON.parse(rawNoteData);

    
    res.json(parsedNotes);
    res.status(200);
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
        res.status(500).json('oops something went wrong the note has not been added to the database');
    }

});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
    // get the id of the note selected for delet
    const noteId = req.params.id;

    // check to confirm route is implemented correctly
    console.log(yellow, `⚠️ ${req.method} request received to delete note with id ${noteId}`);

    // try catch for delete method
    try {

        // read existing note data
        const rawNoteData = fs.readFileSync('./db/db.json', 'utf-8');
        
        // initialize notes data to memory
        let notes = JSON.parse(rawNoteData);

        // find the index of the note with the specified id
        const noteIndex = notes.findIndex(note => note.id === noteId);
        
        if (noteIndex !== -1) {

            // eliminate the note
            notes.splice(noteIndex, 1)
            
            // write the updated notes data to the db.json file
            await fs.promises.writeFile('./db/db.json', JSON.stringify(notes), 'utf-8');
            
            res.status(200).json({ message: 'Note deleted successfully' });
            console.log(red, `🗑️ ${noteId} Note successfully deleted from the database!`);
        } else {
            res.status(404).json({ message: 'Note not found' });
            console.log(red, `❌ Note not found`);
        }
    } catch (err) {
        console.log(red, '💀 Failed to delete note from the database 💀');
        res.status(500).json({ message: 'oops something went wrong the note has NOT been deleted' });
    }
});



// express functional code
app.use(express.static("public"));
app.use(express.json())

app.listen(PORT, () => {
    console.log(green, `😎 Server is running on port ${PORT}`)
})