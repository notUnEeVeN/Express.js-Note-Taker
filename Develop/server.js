const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
//declaring port 
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Develop/public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//this code retrieves notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

//this section of codes handles the creation of new notes to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;

        const notes = JSON.parse(data);
        newNote.id = Date.now().toString();
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

//this section of code handles the deletion of notes from dm.json
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    //reading existing notes
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;

        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        //updates notes to json
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json({message: "Note deleted"});
        });
    });
});

// Starting the server and listen on the given port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);