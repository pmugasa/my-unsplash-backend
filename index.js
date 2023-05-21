require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Image = require("./models/image");
const cors = require("cors");
//mongoDB config
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("Connected to mongoDB");
  })
  .catch((error) => {
    console.error("Couldn't connect to mongoDB:", error.message);
  });

//middleware

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

//ROUTES
app.get("/images", (req, res) => {
  Image.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

//post image
app.post("/images", async (req, res) => {
  const body = req.body;
  const image = new Image({
    label: body.label,
    photoUrl: body.photoUrl,
  });
  try {
    const savedimage = await image.save();
    res.status(201).json(savedimage);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete image
app.delete("/images/:id", async (req, res) => {
  const id = req.params.id;
  await Image.findByIdAndDelete(id);
  res.status(200).json({ message: "Successfully deleted" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
