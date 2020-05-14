const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  userName: String,
  image: {
    type: String,
    default:
      "https://media-exp1.licdn.com/dms/image/C4D03AQE3_v9XLjqxgQ/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=yN9dZ5gaVNjj2PIYy-I2qlNuBVdDujbO4fDjfvn8WmU",
  },

  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],

  preferences: [
    {
      favoriteSport: { type: Schema.Types.ObjectId, ref: "Sport" },
      level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    },
  ],

  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
    address: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
