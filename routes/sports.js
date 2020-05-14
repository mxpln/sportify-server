const express = require("express");
const router = express.Router();
const Sports = require("../models/Sport");

router.get("/", (req, res, next) => {
  Sports.find()
    .then((sportsDocument) => {
      res.status(200).json(sportsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
