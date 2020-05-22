const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const Sport = require("../models/Sport");

// @desc      Edit user favorite sports
// @route     /api/user/sports/:preferenceID
// @verb      PATCH
router.patch("/sports/:preferenceID", (req, res, next) => {
  const preferences = req.params.preferenceID;
  Users.findByIdAndUpdate(req.session.currentUser._id, {
      $pull: {
        preferences: {
          _id: preferences
        }
      },
    })
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
// @desc      Get all the user sports
// @route     /api/user/sports
// @verb      GET
router.get("/sports", (req, res, next) => {
  Users.findById(req.session.currentUser._id)
    // .populate("preferences.favoriteSport")
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get all the user events
// @route     /api/user/event
// @verb      GET
router.get("/events", (req, res, next) => {
  Users.findById(req.session.currentUser._id)
    .populate("events")
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get an user
// @route     /api/user/:id
// @verb      GET
router.get("/:id", (req, res, next) => {
  Users.findById(req.params.id)
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Update an user
// @route     /api/user/:id
// @verb      PATCH
router.patch("/:id", (req, res, next) => {
  Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    .then((usersDocument) => {
      res.status(200).json(usersDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;