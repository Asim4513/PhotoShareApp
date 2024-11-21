/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the project6 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const express = require("express");
const app = express();

// Load the express middleware modules
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require('fs');

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
// const models = require("./modelData/photoApp.js").models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", async function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    try{

      const info = await SchemaInfo.find({});
      if (info.length === 0) {
            // No SchemaInfo found - return 500 error
            return response.status(500).send("Missing SchemaInfo");
      }
      console.log("SchemaInfo", info[0]);
      return response.json(info[0]); // Use `json()` to send JSON responses
    } catch(err){
      // Handle any errors that occurred during the query
      console.error("Error in /test/info:", err);
      return response.status(500).json(err); // Send the error as JSON
    }

  } else if (param === "counts") {
   // If the request parameter is "counts", we need to return the counts of all collections.
// To achieve this, we perform asynchronous calls to each collection using `Promise.all`.
// We store the collections in an array and use `Promise.all` to execute each `.countDocuments()` query concurrently.
   
    
const collections = [
  { name: "user", collection: User },
  { name: "photo", collection: Photo },
  { name: "schemaInfo", collection: SchemaInfo },
];

try {
  await Promise.all(
    collections.map(async (col) => {
      col.count = await col.collection.countDocuments({});
      return col;
    })
  );

  const obj = {};
  for (let i = 0; i < collections.length; i++) {
    obj[collections[i].name] = collections[i].count;
  }
  return response.end(JSON.stringify(obj));
} catch (err) {
  return response.status(500).send(JSON.stringify(err));
}
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    return response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get('/user/list', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const users = await User.find({}, '_id first_name last_name');  // Use projection to select only needed fields
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching user list');
  }

  return false;
});




/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get('/user/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const user = await User.findById(req.params.id, '_id first_name last_name location description occupation');
    if (!user) {
      return res.status(404).send('User not found');
    }
    return res.json(user);  // Explicit return for consistency
  } catch (error) {
    return res.status(400).send('Invalid user ID');  // Add return here to satisfy consistent-return rule
  }
});



/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get('/photosOfUser/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const photos = await Photo.find({ user_id: req.params.id }, '-__v').lean();  // Exclude __v field

    await Promise.all(
      photos.map(async (photo) => {
        photo.comments = await Promise.all(
          photo.comments.map(async (comment) => {
            const user = await User.findById(comment.user_id, '_id first_name last_name');
            const { user_id, ...commentWithoutUserId } = comment;  // Exclude user_id from each comment
            return { ...commentWithoutUserId, user };  // Include only the necessary comment fields with user details
          })
        );
      })
    );

    res.json(photos);
  } catch (error) {
    res.status(400).send('Invalid user ID');
  }

  return false;
});

app.post('/admin/login', async (req, res) => {
  const { login_name, password } = req.body;
  const user = await User.findOne({ login_name });
  if (!user || user.password !== password) {
    return res.status(400).send("Invalid login name or password");
  }
  req.session.userId = user._id;
  res.json({ _id: user._id, first_name: user.first_name });

  return false;
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);

  return false;
});

app.post('/user', async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).send("Required fields missing.");
  }
  const existingUser = await User.findOne({ login_name });
  if (existingUser) {
    return res.status(400).send("Login name already exists.");
  }
  const newUser = new User({ login_name, password, first_name, last_name, location, description, occupation });
  await newUser.save();
  res.status(200).send({ login_name });

  return false;
});

/**
 * Enforce log in
 */
function requireLogin(request, response, next) {
  if (!request.session.userId) {
      return response.status(401).send({ error: "Unauthorized" });
  }
  next();
 
  return false;
}

// Apply to all routes that require authentication
app.use('/api', requireLogin);


const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

/**
 * POST /commentsOfPhoto/:photo_id - Add a comment to a specific photo.
 */
app.post('/commentsOfPhoto/:photo_id', requireLogin, async (req, res) => {
  const photoId = req.params.photo_id;
  const { comment } = req.body;

  if (!comment) {
      return res.status(400).send('Comment must not be empty');
  }

  try {
      const photo = await Photo.findById(photoId);
      if (!photo) {
          return res.status(404).send('Photo not found');
      }

      const newComment = {
          comment: comment,
          user_id: req.session.userId,
          date_time: new Date(),
      };

      photo.comments.push(newComment);
      await photo.save();

      // Populate user data for the new comment
      const updatedPhoto = await Photo.findById(photoId).populate('comments.user_id', 'first_name last_name');
      res.status(200).send(updatedPhoto);
  } catch (error) {
      console.error('Failed to add comment:', error);
      res.status(500).send('Internal server error');
  }

  return false;
});


// Set up multer with memory storage
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');

app.post('/photos/new', (req, res) => {
  processFormBody(req, res, async function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).send('Error uploading file.');
    }

    if (!req.file) {
      console.error('No file received');
      return res.status(400).send('No file uploaded.');
    }

    if (!req.session.userId) {
      console.error('Unauthorized access');
      return res.status(401).send('Unauthorized');
    }

    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `U${timestamp}_${req.file.originalname}`;
      console.log('Generated filename:', filename);

      // Save the file to the filesystem
      const filePath = `./images/${filename}`;
      await fs.promises.writeFile(filePath, req.file.buffer);
      console.log('File saved successfully:', filePath);

      // Save the photo to the database
      const newPhoto = {
        user_id: req.session.userId,
        file_name: filename,
        date_time: new Date(),
      };

      const photo = new Photo(newPhoto);
      await photo.save();
      console.log('Photo saved to database:', photo);

      // Respond with a 200 OK instead of 201 Created
      res.status(200).json(photo);
      console.log('Response sent');
    } catch (error) {
      console.error('Error handling /photos/new:', error);
      res.status(500).send('Internal server error');
    }

    return false;
  });
});
