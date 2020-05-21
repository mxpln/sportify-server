const express = require("express");
const router = express.Router();
const Events = require("../models/Event");
const User = require("../models/User");
const upload = require("../config/cloudinary");

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
  Events.find({
      type: "individual",
    })
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Create a solo course
// @route     /api/events/solo/new
// @verb      POST
router.post("/solo/new", upload.single("image"), (req, res, next) => {
  // const sports = Sport.find()
  const creator = req.session.currentUser._id;
  const individualNbrOfParticipants = [creator];
  const type = "individual";
  const {
    title,
    description,
    sportType,
    date,
    level,
    maxPlayers,
    location,
  } = req.body;
  const newEvents = new Events({
    title,
    description,
    individualNbrOfParticipants,
    creator,
    level,
    sportType,
    maxPlayers,
    type,
    date,
    location,
  });
  if (req.file) {
    newEvents.image = req.file.url;
  }
  newEvents
    .save()
    .then((eventsDocument) => {
      res.status(201).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Get all the multi courses
// @route     /api/events/multi
// @verb      GET
router.get("/multi", (req, res, next) => {
  Events.find({
      type: "collective",
    })
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
    .populate("sportType")
    .populate("creator")
    .populate("individualNbrOfParticipants")
    .populate("teamA")
    .populate("teamB")
    .then((eventsDocument) => {
      // User.findById(req.session.currentUser._id)
      //   .populate("events")
      //   .then((userDocument) => res.status(200).json(userDocument))
      //   .catch((error) => {
      //     res.status(500).json(error);
      //   });
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Create new collective course
// @route     /api/events/multi/new
// @verb      POST
router.post("/multi/new", upload.single("image"), (req, res, next) => {
  // const sports = Sport.find()
  const creator = req.session.currentUser._id;
  const teamA = [creator];
  const type = "collective";
  const {
    title,
    description,
    sportType,
    maxPlayersByTeam,
    date,
    level,
    location,
  } = req.body;
  const newEvents = new Events({
    title,
    description,
    maxPlayersByTeam,
    creator,
    teamA,
    sportType,
    type,
    level,
    date,
    location,
  });
  if (req.file) {
    newEvents.image = req.file.url;
  }
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
  Events.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
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
        promise = Events.findByIdAndUpdate(
          req.params.id, {
            $addToSet: {
              teamB: req.session.currentUser._id,
            },
          }, {
            new: true
          }
        ).populate("teamB").populate('teamA');
      } else if (dbRes.teamA.length !== dbRes.maxPlayersByTeam) {
        promise = Events.findByIdAndUpdate(
          req.params.id, {
            $addToSet: {
              teamA: req.session.currentUser._id,
            },
          }, {
            new: true
          }
        ).populate("teamA").populate('teamB');
      } else {
        res.status(500).json({
          message: "error",
        });
      }
      promise
        .then((eventsDocument) => {
          User.findByIdAndUpdate(
              req.session.currentUser._id, {
                $addToSet: {
                  events: req.params.id,
                },
              }, {
                new: true
              }
            )
            .then((dbRes) => {
              res.status(201).json({
                dbRes,
                eventsDocument
              });
            })
            .catch((dbErr) => {
              console.log(dbErr);
            });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Join a solo course
// @route     /api/events/solo/:id/join
// @verb      POST
router.post("/solo/:id/join", (req, res, next) => {
  // Events.find({
  //     type: "individual",
  //   })
  //   .then(
  Events.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        individualNbrOfParticipants: req.session.currentUser._id,
      }
    }, {
      new: true
    }).populate('individualNbrOfParticipants')
    .then((eventsDocument) => {
      User.findByIdAndUpdate(req.session.currentUser._id, {
          $addToSet: {
            events: req.params.id,
          },
        }, {
          new: true
        })
        .then((userDocument) => {
          console.log("===========>", userDocument)
          res.status(201).json({
            eventsDocument,
            userDocument
          });
          // req.session.currentUser = userDocument;
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    })
  // )
  // .catch((err) => {
  //   res.status(500).json(err);
  // });
});

// @desc      Leave a collective course
// @route     /api/events/multi/:id/leave
// @verb      DELETE
// @desc      Leave a collective course
// @route     /api/events/multi/:id/leave
// @verb      DELETE
router.post("/multi/:id/leave", (req, res) => {
  Events.findByIdAndUpdate(
      req.params.id, {
        $pull: {
          teamA: req.session.currentUser._id,
          teamB: req.session.currentUser._id,
        },
      }, {
        new: true
      }
    )
    .populate("teamA")
    .populate("teamB")
    .then((eventsDocument) => {
      User.findByIdAndUpdate(
          req.session.currentUser._id, {
            $pull: {
              events: req.params.id,
            },
          }, {
            new: true
          }
        )
        .populate("events")
        .then((updatedUser) => {
          res.status(201).json({
            eventsDocument,
            updatedUser
          });
          req.session.currentUser = updatedUser;
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// @desc      Leave a solo course
// @route     /api/events/solo/:id/leave
// @verb      DELETE
router.post("/solo/:id/leave", (req, res) => {
  Events.findByIdAndUpdate(req.params.id, {
      $pull: {
        individualNbrOfParticipants: req.session.currentUser._id,
      },
    }, {
      new: true
    }).populate('individualNbrOfParticipants')
    .then((eventsDocument) => {
      User.findByIdAndUpdate(req.session.currentUser._id, {
          $pull: {
            events: req.params.id,
          },
        }, {
          new: true
        }).populate('events')
        .then((userDocument) => {
          res.status(201).json({
            userDocument,
            eventsDocument
          });
          req.session.currentUser = userDocument;
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

// @desc      Get comments of a course
// @route     /api/events/:id/chat
// @verb      GET
router.get("/:id/chat", (req, res, next) => {
  // const { comments } = req.body;
  Events.findById(req.params.id, "comments")
    .populate("author")
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
  Events.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        comments: {
          message: req.body.message,
          author: author,
        },
      },
    })
    .then((eventsDocument) => {
      res.status(201).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// @desc      Delete a comment
// @route     /api/events/:id/chat/
// @verb      DELETE
router.delete("/:id/chat/:commentId", (req, res, next) => {
  // const author = req.session.currentUser._id;
  const message = req.params.commentId;
  Events.findByIdAndUpdate(
      req.params.id, {
        $pull: {
          comments: {
            _id: message,
          },
        },
      }, {
        new: true,
      }
    )
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;