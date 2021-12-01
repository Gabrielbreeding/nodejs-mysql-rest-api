// Add Node.js core modules
const path = require('path');

// Add NPM Packages
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Instantiate an instance of express
const app = express();

// Set PORT variable
const PORT = process.env.PORT || 4444;

function getConnection() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'books'
    })
    return connection;
}

// Use middleware
app.use(morgan('short'));
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));

// Add '/' route handler
app.get('/', (req, res) => {
    res.send('Welcome to my Node.js MySQL REST API app!');
});

// Add show all authors page
app.get('/authors', (req, res) => {
    let queryString = 'SELECT * FROM authors';
    getConnection().query(queryString, (err, rows, fields) => {
        if (err) throw err;

        const authors = rows.map((row) => {
            return {first_name: row.first_name, last_name: row.last_name};
        })

        res.json(authors);
    })
});

app.get('/publishers', (req, res) => {
    let queryString = 'SELECT * FROM publishers';
    getConnection().query(queryString, (err, rows, fields) => {
        if (err) throw err;

        const publishers = rows.map((row) => {
            return {publisher_name: row.publisher_name};
        })

        res.json(publishers);
    })
});

app.get('/titles', (req, res) => {
    let queryString = 'SELECT * FROM titles';
    getConnection().query(queryString, (err, rows, fields) => {
        if (err) throw err;

        const titles = rows.map((row) => {
            return {isbn: row.isbn, title: row.title, edition: row.edition_number, publisher_id: row.publisher_id, price: row.price}
        })

        res.json(titles);
    })
})



// Add show single authors page
app.get('/author/:id', (req, res) => {
    const userID = req.params.id;
    let queryString = 'SELECT * FROM authors WHERE author_id = ?';
    getConnection().query(queryString, [userID], (err, rows, fields) => {
        if (userID <= 0) {
            res.status(500).json("Author ids less than or equal to zero do not exist silly!");
        }
        const author = rows.map((row) => {
            return {first_name: row.first_name, last_name: row.last_name};
        })

        res.json(author);
    })
});

app.get('/publisher/:id', (req, res) => {
    const userID = req.params.id;
    let queryString = 'SELECT * FROM publishers WHERE publisher_id = ?';
    getConnection().query(queryString, [userID], (err, rows, fields) => {
        if (userID <= 0) {
            res.status(500).json("Publisher ids less than or equal to zero do not exist silly!");
        }
        const publisher = rows.map((row) => {
            return {publisher: row.publisher_name};
        })

        res.json(publisher);
    })
});

app.get('/title/:id', (req, res) => {
    const userID = req.params.id;
    let queryString = 'SELECT * FROM titles WHERE title_id = ?';
    getConnection().query(queryString, [userID], (err, rows, fields) => {
        if (userID <= 0) {
            res.status(500).json("title ids less than or equal to zero do not exist silly!");
        }
        const title = rows.map((row) => {
            return {isbn: row.isbn, title: row.title, edition: row.edition_number, publisher_id: row.publisher_id, price: row.price};
        })

        res.json(title);
    })
});

app.get('/newAuthor', (req, res) => {
    res.send(`<html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
  
      <!-- Bootstrap CSS -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
  
      <title>Add New Author</title>
    </head>
    <body>
      <h1>Add A New Author Below:</h1>
  
      <form action="/newAuthor" method="POST">
          <div class="mb-3">
              <label for="firstName" class="form-label">First Name:</label>
              <input type="text" class="form-control" id="firstName" name="firstName" required>
          </div>
          <div class="mb-3">
              <label for="lastName" class="form-label">Last Name:</label>
              <input type="text" class="form-control" id="lastName" name="lastName" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
  
      <!-- Optional JavaScript; choose one of the two! -->
  
      <!-- Option 1: Bootstrap Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
    </body>
  </html>`)
});

app.get('/newPublisher', (req, res) => {
    res.send(`<html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
  
      <!-- Bootstrap CSS -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
  
      <title>Add New Publisher</title>
    </head>
    <body>
      <h1>Add A New Publisher Below:</h1>
  
      <form action="/newPublisher" method="POST">
          <div class="mb-3">
              <label for="publisherName" class="form-label">Publisher:</label>
              <input type="text" class="form-control" id="publisherName" name="publisherName" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
  
      <!-- Optional JavaScript; choose one of the two! -->
  
      <!-- Option 1: Bootstrap Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
    </body>
  </html>`)
});

app.get('/newTitle', (req, res) => {
    res.send(`<html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
  
      <!-- Bootstrap CSS -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
  
      <title>Add New Title</title>
    </head>
    <body>
      <h1>Add A New Title Below:</h1>
  
      <form action="/newTitle" method="POST">
          <div class="mb-3">
              <label for="title" class="form-label">Title:</label>
              <input type="text" class="form-control" id="title" name="title" required>
          </div>
          <div class="mb-3">
              <label for="isbn" class="form-label">Isbn:</label>
              <input type="text" class="form-control" id="isbn" name="isbn" required>
          </div>
          <div class="mb-3">
              <label for="edition" class="form-label">Edition:</label>
              <input type="number" class="form-control" id="edition" name="edition" required>
          </div>
          <div class="mb-3">
              <label for="publisherId" class="form-label">PublisherID:</label>
              <input type="number" class="form-control" id="publisherId" name="publisherId" required>
          </div>
          <div class="mb-3">
              <label for="copyright" class="form-label">Copyright:</label>
              <input type="number" class="form-control" id="copyright" name="copyright" required>
          </div>
          <div class="mb-3">
              <label for="price" class="form-label">Price:</label>
              <input type="text" class="form-control" id="price" name="price" required>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
  
      <!-- Optional JavaScript; choose one of the two! -->
  
      <!-- Option 1: Bootstrap Bundle with Popper -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
    </body>
  </html>`)
});

// Add new author POST route
app.post('/newAuthor', (req, res) => {
    const first_name = req.body.firstName.trim();
    const last_name = req.body.lastName.trim();
    let queryString =  `INSERT INTO authors (first_name, last_name) VALUES (?, ?)`;
    // Check for empty values
    if ((first_name === "") || (last_name === "")) {
        console.log(`Failed to insert new user: ${err}`)
        res.sendStatus(500);
        return;
    }
    getConnection().query(queryString, [first_name, last_name], (err, results, fields) => {
        if (err) {
            console.log(`Failed to insert new author: ${err}`)
            res.sendStatus(500);
            return;
        }
    });
    console.log(`Inserted a new user with id: ${id}`);
});

app.post('/newPublisher', (req, res) => {
    const publisher_name = req.body.publisherName.trim();
    let queryString =  `INSERT INTO publishers (publisher_name) VALUE (?)`;
    // Check for empty values
    if (publisher_name === "") {
        console.log(`Failed to insert new publisher: ${err}`)
        res.sendStatus(500);
        return;
    }
    getConnection().query(queryString, publisher_name, (err, results, fields) => {
        if (err) {
            console.log(`Failed to insert new user: ${err}`)
            res.sendStatus(500);
            return;
        }
        //console.log(`Inserted a new user with id: ${insertId}`);
    });
});

app.post('/newTitle', (req, res) => {
    const isbn = req.body.isbn.trim();
    const title = req.body.title.trim();
    const edition_number = req.body.editionNumber.trim();
    const copyright = req.body.copyright.trim();
    const publisher_id = req.body.publisherId.trim();
    const price = req.body.price.trim();
    let queryString =  `INSERT INTO titles (isbn, title, edition_number, copyright, publisher_id, price) VALUES (?, ?, ?, ?, ?, ?)`;
    // Check for empty values
    if ((isbn === "") || (title === "") || (edition_number === "") || (copyright === 0) || (publisher_id === 0) || (price === "")) {
        console.log(`Failed to insert new Title: ${err}`)
        res.sendStatus(500);
        return;
    }
    getConnection().query(queryString, [isbn, title, edition_number, copyright, publisher_id, price], (err, results, fields) => {
        if (err) {
            console.log(`Failed to insert new Title: ${err}`)
            res.sendStatus(500);
            return;
        }
        //console.log(`Inserted a new user with id: ${insertId}`);
    });
});



// Begin running server
app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});