const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// const Redis = require("ioredis");

// const cluster = new Redis.Cluster([
//   {
//     port: 8001,
//     host: "127.0.0.1",
//   },
//   {
//     port: 6379,
//     host: "127.0.0.1",
//   },
// ]);

let db;

router.post("/registerNewUser", async (req, res) => {
  let user = req.body;

  const alreadyExistingUserName = await db
    .collection("Users")
    .findOne({ username: user.username });
  const alreadyExistingEmail = await db
    .collection("Users")
    .findOne({ email: user.email });

  if (alreadyExistingUserName || alreadyExistingEmail) {
    res.send({ status: false, msg: "Username or Email already exists!" });
  } else {
    const hashPassword = await bcrypt.hash(user.password, 10);

    await db.collection("Users").insertOne({
      username: user.username,
      email: user.email,
      password: hashPassword,
    });
    res.send({ status: true, msg: "New User Created!" });
  }
});

router.post("/loginUser", async (req, res) => {
  let user = req.body;
  console.log("user: ", user);

  db.collection("Users")
    .findOne({ username: user.username })
    .then((loginUser) => {
      if (!loginUser) {
        res.send({ status: false, msg: "Invalid Username or Password" });
      }
      console.log(loginUser);
      bcrypt.compare(user.password, loginUser.password).then((validUser) => {
        console.log(validUser);
        if (validUser) {
          const payload = {
            id: validUser._id,
            username: validUser.username,
          };
          jwt.sign(
            payload,
            "ABC1234$$$$",
            { expiresIn: 86400 },
            (err, token) => {
              if (err) return res.send({ status: false, msg: err });
              return res.send({
                msg: "Success",
                token: "Bearer " + token,
                username: validUser.username,
                status: true,
              });
            }
          );
        } else {
          res.send({ status: false, msg: "Invalid Username or Password" });
        }
      });
    });
});

router.get("/likedMovies", async (req, res) => {
  console.log(req.query);
  // cluster.set("foo", "bar");
  // cluster.get("foo", (err, res) => {
  //   // res === 'bar'
  //   console.log(res);
  // });
  res.send(
    await db.collection("test").find({ username: req.query.username }).toArray()
  );
});

router.post("/likedMovies", async (req, res) => {
  let { movieId, title, poster, rating, username } = req.body;

  const alreadyExisting = await db
    .collection("test")
    .findOne({ name: movieId });

  if (alreadyExisting) {
    res.send({ status: false, msg: "movie already added to the list" });
  } else {
    await db
      .collection("test")
      .insertOne({ movieId, title, poster, rating, username });
    console.log(`Created Player ${title}`);
    res.send({ status: true, msg: "Movies Saved in the List" });
  }
});

router.delete("/likedMovies/:id", async (req, res) => {
  console.log(req.params);
  await db.collection("test").deleteOne({ movieId: parseInt(req.params.id) });
  res.send({ status: true, msg: "Movie removed from the list" });
});

router.get("/watchlistMovies", async (req, res) => {
  res.send(
    await db
      .collection("test-1")
      .find({ username: req.query.username })
      .toArray()
  );
});

router.post("/watchlistMovies", async (req, res) => {
  let { movieId, title, poster, rating, username } = req.body;

  const alreadyExisting = await db
    .collection("test-1")
    .findOne({ name: movieId });

  if (alreadyExisting) {
    res.send({ status: false, msg: "movie already added to the list" });
  } else {
    await db
      .collection("test-1")
      .insertOne({ movieId, title, poster, rating, username });
    console.log(`Created Player ${title}`);
    res.send({ status: true, msg: "Movies Saved in the List" });
  }
});

router.delete("/watchlistMovies/:id", async (req, res) => {
  console.log(req.params);
  await db.collection("test-1").deleteOne({ movieId: parseInt(req.params.id) });
  res.send({ status: true, msg: "Movie removed from the list" });
});

router.get("/likedTv", async (req, res) => {
  res.send(
    await db
      .collection("test-2")
      .find({ username: req.query.username })
      .toArray()
  );
});

router.post("/likedTv", async (req, res) => {
  let { tvId, title, poster, rating, username } = req.body;

  const alreadyExisting = await db.collection("test-2").findOne({ name: tvId });

  if (alreadyExisting) {
    res.send({ status: false, msg: "movie already added to the list" });
  } else {
    await db
      .collection("test-2")
      .insertOne({ tvId, title, poster, rating, username });
    console.log(`Created Player ${title}`);
    res.send({ status: true, msg: "Movies Saved in the List" });
  }
});

router.delete("/likedTv/:id", async (req, res) => {
  console.log(req.params);
  await db.collection("test-2").deleteOne({ tvId: parseInt(req.params.id) });
  res.send({ status: true, msg: "TV removed from the list" });
});

router.get("/watchlistTv", async (req, res) => {
  res.send(
    await db
      .collection("test-3")
      .find({ username: req.query.username })
      .toArray()
  );
});

router.post("/watchlistTv", async (req, res) => {
  let { tvId, title, poster, rating, username } = req.body;

  const alreadyExisting = await db.collection("test-3").findOne({ name: tvId });

  if (alreadyExisting) {
    res.send({ status: false, msg: "movie already added to the list" });
  } else {
    await db
      .collection("test-3")
      .insertOne({ tvId, title, poster, rating, username });
    console.log(`Created Player ${title}`);
    res.send({ status: true, msg: "Movies Saved in the List" });
  }
});

router.delete("/watchlistTv/:id", async (req, res) => {
  console.log(req.params);
  await db.collection("test-3").deleteOne({ tvId: parseInt(req.params.id) });
  res.send({ status: true, msg: "TV removed from the list" });
});

const url = process.env.DB_URL;

(async () => {
  let client = await MongoClient.connect(url, { useNewUrlParser: true });
  console.log("line 132: ", client.db("test"));

  // if (db) {
  db = client.db("test");
  // console.log("Database is Connected!");
  // }
})();

// Create a new MongoClient
// const client = new MongoClient(url);
// async () => {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();
//     // Establish and verify connection
//     await client.db("test").command({ ping: 1 });
//     console.log("Connected successfully to server");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

module.exports = router;
