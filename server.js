require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET /notes should return the notes.html file.
app.get("/notes", (req, res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
});

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, notes) => {
    if (err) {
      return res.status(500).json({ err });
    }
    res.json(JSON.parse(notes));
  });
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  fs.readFile(`${__dirname}/db/db.json`, "utf8", (err, notes) => {
    if (err) {
      return res.status(500).json({ err });
    }
    const data = JSON.parse(notes);
    data.push({
      id: uuidv4(),
      title,
      text,
    });

    fs.writeFile(
      `${__dirname}/db/db.json`,
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ err });
        }
        res.json({ title, text });
      }
    );
  });
});

//DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete("/api/notes/:id", (req, res) => {});

// GET * should return the index.html file.
// a catch-all route that's used as fall back, so should be the last route being defined
app.get("*", (res, req) => {
  res.sendFile(path.join(__dirname, "/public"));
});

app.listen(process.env.PORT, () =>
  console.log(`Server started on PORT http://localhost:${process.env.PORT}`)
);
