const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const Sport = require("../models/Sport");
router.get("/:id", (req, res, next) => {
  Users.findById(req.params.id)
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.patch("/:id", (req, res, next) => {
  Users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:id/sports", (req, res, next) => {
  Users.findById(req.params.id)
    .populate("preferences.favoriteSport")
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.patch("/:id/sports", (req, res, next) => {
  Users.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
