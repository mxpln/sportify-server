const express = require("express");
const router = express.Router();
const Events = require("../models/Event");
const Sports = require("../models/Sport");

// @desc      Get all the courses
// @route     /api/events
// @verb      GET
router.get("/", (req, res, next) => {
  Events.find()
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get all the solo courses
// @route     /api/events/solo
// @verb      GET
router.get("/solo", (req, res, next) => {
  Events.find({ type: "individual" })
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get all the multi courses
// @route     /api/events/multi
// @verb      GET
router.get("/multi", (req, res, next) => {
  Events.find({ type: "collective" })
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get one course
// @route     /api/events/:id
// @verb      GET
router.get("/:id", (req, res, next) => {
  Events.findById(req.params.id)
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Create new collective course
// @route     /api/events/multi/new
// @verb      POST
router.post("/multi/new", (req, res, next) => {
  // const sports = Sport.find()
  const creator = req.session.currentUser._id;
  const teamA = [creator];
  const {
    title,
    description,
    sportType,
    type,
    maxPlayersByTeam,
    date,
  } = req.body;
  const newEvents = new Events({
    title,
    description,
    maxPlayersByTeam,
    creator,
    teamA,
    sportType,
    type,
    date,
  });
  newEvents
    .save()
    .then((eventsDocument) => {
      res.status(201).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Edit one course
// @route     /api/events/:id
// @verb      PATCH
router.patch("/:id", (req, res, next) => {
  Events.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Delete one course
// @route     /api/events/:id
// @verb      DELETE
router.delete("/:id", (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((eventsDocument) => {
      res.status(204).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Join a collective course
// @route     /api/events/multi/:id/join
// @verb      POST
router.post("/multi/:id/join", (req, res, next) => {
  Events.findById(req.params.id)
    .then((dbRes) => {
      let promise;
      if (
        dbRes.teamA.length > dbRes.teamB.length &&
        dbRes.teamB.length !== dbRes.maxPlayersByTeam
      ) {
        promise = Events.findByIdAndUpdate(req.params.id, {
          $addToSet: {
            teamB: req.session.currentUser._id,
          },
        });
      } else if (dbRes.teamA.length !== dbRes.maxPlayersByTeam) {
        promise = Events.findByIdAndUpdate(req.params.id, {
          $addToSet: {
            teamA: req.session.currentUser._id,
          },
        });
      } else {
        res.status(500).json({ message: "error" });
      }
      promise
        .then((eventsDocument) => {
          res.status(201).json(eventsDocument);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

// @desc      Leave a collective course
// @route     /api/events/multi/:id/leave
// @verb      DELETE
router.delete("/multi/:id/leave", (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((eventsDocument) => {
      res.status(204).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Leave a collective course
// @route     /api/events/solo/:id/leave
// @verb      DELETE
router.delete("/solve/:id/leave", (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((eventsDocument) => {
      res.status(204).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get comments of a course
// @route     /api/events/:id/chat
// @verb      GET
router.get("/:id/chat", (req, res, next) => {
  //   const { comments } = req.body;
  Events.findById(req.params.id, "comments")
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Post a new comment
// @route     /api/events/:id/chat
// @verb      POST
router.post("/:id/chat", (req, res, next) => {
  const author = req.session.currentUser._id;
  console.log(req.body);
  Events.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      comments: { message: req.body.message, author: author },
    },
  })
    .then((eventsDocument) => {
      res.status(201).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
