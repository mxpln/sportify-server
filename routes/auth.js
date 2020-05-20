const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const upload = require("../config/cloudinary");

const salt = 10;

// @desc      Signs in a user sending the user info
// @route     /api/auth/signin
// @verb      POST
router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({
    email,
  })
    .populate("preferences.favoriteSport")
    .then((userDocument) => {
      if (!userDocument) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      const isValidPassword = bcrypt.compareSync(
        password,
        userDocument.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      const userObj = userDocument.toObject();
      delete userObj.password;
      req.session.currentUser = userObj;
      res.status(200).json(userObj);
    });
});

// @desc      Signs up a user sending the user info
// @route     /api/auth/signup
// @verb      POST
router.post("/signup", upload.single("image"), (req, res, next) => {
  const { email, password, firstName, lastName, preferences } = req.body;
  console.log("req?body of signup", req.body);

  User.findOne({
    email,
  }).then((userDocument) => {
    if (userDocument) {
      return res.status(400).json({
        message: "Email already taken",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      email,
      lastName,
      firstName,
      password: hashedPassword,
      preferences,
    };
    if (req.file) {
      newUser.image = req.file.url;
    }
    User.create(newUser)
      .then((userDocument) => {
        userDocument
          .populate("preferences.favoriteSport")
          .execPopulate()
          .then((user) => {
            const userObj = user.toObject();
            delete userObj.password;
            req.session.currentUser = userObj;
            res.status(200).json(userObj);
          })
          .catch((error) => res.status(500).json(error));
      })
      .catch((error) => res.status(500).json(error));
    // const t = new User(newUser);
    // t.save()
    //   .then((t) => t.populate("preferences.favoriteSport"))
    //   // User.create(newUser)
    //   .then((newUserDocument) => {
    //     console.log(newUserDocument);
    //     const userObj = newUserDocument.toObject();
    //     delete userObj.password;
    //     req.session.currentUser = userObj;

    //     res.status(201).json(userObj);
    //   });
  });
});

// @desc      Get’s the information of a user currently in the session
// @route     /api/auth/isLoggedIn
// @verb      GET
router.get("/isLoggedIn", (req, res, next) => {
  if (req.session.currentUser) {
    const id = req.session.currentUser._id;
    User.findById(id)
      .populate("preferences.favoriteSport")
      .then((userDocument) => {
        const userObj = userDocument.toObject();
        delete userObj.password;
        res.status(200).json(userObj);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
});

// @desc      Logs out a user, destroys the session
// @route     /api/auth/logout
// @verb      GET
router.get("/logout", (req, res, next) => {
  req.session.destroy(function (error) {
    if (error) res.status(500).json(error);
    else
      res.status(200).json({
        message: "Succesfully disconnected.",
      });
  });
});

router.post("/edit-profile", upload.single("image"), (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  console.log("req.body", req.body);

  // User.findOne({
  //   email,
  // }).then((userDocument) => {
  //   if (userDocument) {
  //     return res.status(400).json({
  //       message: "Email already taken",
  //     });
  //   }

  // const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = {
    email,
    lastName,
    firstName,
    // password: hashedPassword,
    // preferences,
  };
  if (req.file) {
    newUser.image = req.file.url;
  }
  User.findByIdAndUpdate(req.session.currentUser._id, newUser, { new: true })
    .populate("preferences.favoriteSport")
    .then((userObj) => {
      res.status(201).json(userObj);
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
  // User.create(newUser).then((newUserDocument) => {
  //   console.log(newUserDocument);
  //   const userObj = newUserDocument.toObject();
  //   delete userObj.password;
  //   req.session.currentUser = userObj;
  //   res.status(201).json(userObj);
  // });
});
// });

module.exports = router;
