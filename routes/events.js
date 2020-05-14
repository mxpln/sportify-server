const express = require("express");
const router = express.Router();
const Events = require("../models/Event");

router.get("/", (req, res, next) => {
  Events.find()
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:id", (req, res, next) => {
  Events.findById(req.params.id)
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/new", (req, res, next) => {
  const creator = req.session.currentUser._id;
  const { title, description } = req.body;
  const individualNbrOfParticipants = req.session.currentUser._id;
  const newEvents = new Events({
    title,
    description,
    creator,
    individualNbrOfParticipants,
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

router.patch("/:id", (req, res, next) => {
  Events.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((eventsDocument) => {
      res.status(200).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/:id", (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((eventsDocument) => {
      res.status(204).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Join an event
router.post("/:id/join", (req, res, next) => {
  Events.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      individualNbrOfParticipants: req.session.currentUser._id,
    },
  })
    .then((eventsDocument) => {
      res.status(201).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/:id/leave", (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((eventsDocument) => {
      res.status(204).json(eventsDocument);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

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
