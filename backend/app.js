const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    // 'mongodb+srv://maximilian:9u4biljMQc4jjqbe@cluster0-ntrwp.mongodb.net/messages?retryWrites=true'
    'mongodb://localhost:27017/udemy', { useNewUrlParser: true} ,
    (error) => {
      if(error) console.log(error);
  
          console.log("connection successful");
  }
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err =>  console.log('err',err));

  const db = mongoose.connection;
  db.on("error", () => {
      console.log("> error occurred from the database");
  });
  db.once("open", () => {
      console.log("> successfully opened the database",db.name);
      new Admin(db.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        var allDatabases = result.databases; 
        console.log(result.databases);   
    });
  });

  // mongoose.connection.on('error', function (err) {
  //   console.log(err)
  //  });
//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --version

  ///db.createCollection("user")
  ///db.createCollection("post")
  //db.user.insert({"email":"lan@gmail.com","password":"123","name":"lan","status":"new",posts:[]})
  //db.post.insert({"title":"post1","imageUrl":"12321","content":"lanqweqwewq","creator":"ObjectId('5de22e2486ce78f17553be45')"})
  // var o = new ObjectId('5de22e2486ce78f17553be45');
  // db.post.insert({"title":"post1","imageUrl":"12321","content":"lanqweqwewq","creator":o})



//   var id = new ObjectId("5de5116bb7a9695abe765c9c");
//   var o = new ObjectId("5de511bdb7a9695abe765c9d");


// db.user.update(
//    { _id: id },
//    { $push: { posts:o } }
// )