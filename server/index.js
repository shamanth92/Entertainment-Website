const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userSavedMovies = require("./routes/api/userMovies");

app.use(express.json());

app.use("/api/movies", userSavedMovies);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on PORT - ${port}`));
