const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser'); // imported fetchuser from the fetchuser.js file.
const Notes = require('../models/Notes'); // imported Notes.js
const { body, validationResult } = require('express-validator'); // imported express-validator to handle invalid inputs for name, email and passwords.

////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
// Route-1 // Get all the notes of logined user, using: GET "/api/notes/getuser" // (Login Required) //

router.get('/fetchallnotes', fetchuser, async (req, res) => { // that fetchuser will fetch the user, it is used for authentication reason while we getting data from the MongoDB.(fetchuser is a middleware which comes from fetchuser.js file).
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes) //this is response as json file
    } catch (error) { // this will catch the error and show the bellow error messages
        console.error(error.message)
        res.status(500).send("Internal Servar Error Doremon")
    }

})

///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Route-2 // Add a new notes, using: POST "/api/notes/addnote" // (Login Required) //

router.post('/addnote', fetchuser, [
    body('title', 'enter valid title doremon').isLength({ min: 3 }),
    body('description', 'enter description atleast 3 characters doremon').isLength({ min: 3 }),
], async (req, res) => { // that fetchuser will fetch the user, it is used for authentication reason because we are accessing the MonogDB.(fetchuser is a middleware which comes from fetchuser.js file).

    try {
        const { title, description, tag } = req.body; //used destructuring.
        // if there are errors, then return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote) //this is response as json file

    } catch (error) { // this will catch the error and show the bellow error messages
        console.error(error.message)
        res.status(500).send("Internal Servar Error Doremon")
    }
})
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Route-3 // Update an existing note, using: PUT "/api/notes/updatenote" // (Login Required) //

// bellow you can see we used the router.put, we used put because we want to update data.
router.put('/updatenote/:id', fetchuser, async (req, res) => { // that fetchuser will fetch the user, it is used for authentication reason because we are accessing the MonogDB.(fetchuser is a middleware which comes from fetchuser.js file).
    const { title, description, tag } = req.body // we used destructuring here// we are getting title, description and tag from the req.body

    try {
        // create new note object
        const newNote = {}; // in the newNote{} we store data to update (updated data means, title, description or tag).
        if (title) { newNote.title = title }; // if we write the new title in the newNote{} then update it.
        if (description) { newNote.description = description }; // if we write the new description in the newNote{} then update it.
        if (tag) { newNote.tag = tag }; // if we write the new tag in the newNote{} then update it.
        // we only want to update one of three fields, which is title, description and tag.

        // Find the note to be updated and update it.
        let note = await Notes.findById(req.params.id); // this (req.params.id) is a id, which is above line also by name id, the line is: router.put('/updatenote/:id', fetchuser
        if (!note) { return res.status(404).send("Not Found Doremon") } // if note not found in the MongoDB then this error will show.

        if (note.user.toString() !== req.user.id) { // if the note's user id and user's user id not matched then return an error, because he is trying to access the other's notes.
            return res.status(404).send("Not Allowed Doremon")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }) // here we provided id and newNote named variable which contains updated fields (data ex: title, description or tag).
        // in the above {new:true} is allow the, if the new contact come then it will be create (not sure about this.)
        res.json({ note }); // sending {note} response as a json.
    } catch (error) { // this will catch the error and show the bellow error messages
        console.error(error.message)
        res.status(500).send("Internal Servar Error Doremon")
    }
})

///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Route-4 // delete an existing note, using: DELETE "/api/notes/updatenote" // (Login Required) //

// bellow you can see we used the router.put, we used put because we want to update data.
router.delete('/deletenote/:id', fetchuser, async (req, res) => { // that fetchuser will fetch the user, it is used for authentication reason because we are accessing the MonogDB.(fetchuser is a middleware which comes from fetchuser.js file).

    try {
        //new// Find the note to be delete and delete it.
        let note = await Notes.findById(req.params.id); // this (req.params.id) is a id, which is above line also by name id, the line is: router.DELETE('/deletenote/:id', fetchuser
        if (!note) { return res.status(404).send("Not Found Doremon") } // if note not found in the MongoDB then this error will show.

        //new// allow deletion only if user own this note
        if (note.user.toString() !== req.user.id) { // if the note's user id and user's user id not matched then return an error, because he is trying to access the other's notes.
            return res.status(404).send("Not Allowed Doremon")
        }

        note = await Notes.findByIdAndDelete(req.params.id) //new// this will find the note and delete it.
        res.json({ 'Success': 'Note has been deleted Doremon', note: note }); //new// sending Success message and deleted not (deleted note preview) response as a json.
    } catch (error) { // this will catch the error and show the bellow error messages
        console.error(error.message)
        res.status(500).send("Internal Servar Error Doremon")
    }
})

/////////////////////////////////////////////////////////////////
module.exports = router //we exported our router