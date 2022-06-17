const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1 : Get All notes using GET /api/fetchallnotes request  . Login Required
router.get("/fetchNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json({ success: true, notes: notes });
  } catch (error) {
    res.status(500);
    res.json({ success: false, err: "Internal server error 4" });
  }
});

// Route 2 : Add notes using POST /api/addNote request  . Login Required

router.post(
  "/addNote",
  [
    body("title", "Enter a Title !").isLength({ min: 3 }),
    body("description", "Enter a Description !").isLength({ min: 5 }),
  ],
  fetchUser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await notes.save();
      res.json({ success: true, added: saveNote });
    } catch (error) {
      res.json({ success: false, err: "Internal server error 5" });
      res.status(500);
    }
  }
);

// Route 3 : Update notes using PUT /api/updateNote request  . Login Required

router.put("/updateNote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the Note to be updated and update it

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, err: "Not found !" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, err: "Not allowed" });
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, err: "Internal server error 6" });
    res.status(500);
  }
});

// Route 3 : Delete notes using PUT /api/delelteNote request  . Login Required

router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    // Find the Note to be deleted and delete it

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ err: "Not found !" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ err: "Not allowed" });
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, err: "Internal server error 7" });
    res.status(500);
  }
});

module.exports = router;
