const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: String,
  sportType: { type: Schema.Types.ObjectId, ref: "Sport" },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  description: String,
  image: {
    type: String,
    default:
      "https://www.paysalia.com/sites/default/files/uploads/728x341-valorisation-sport-ubain.jpg",
  },
  type: {
    type: String,
    enum: ["individual", "collective"],
  },
  maxPlayersByTeam: { type: Number },
  maxPlayers: {
    type: Number,
  },
  individualNbrOfParticipants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  teamA: [{ type: Schema.Types.ObjectId, ref: "User" }],
  teamB: [{ type: Schema.Types.ObjectId, ref: "User" }],
  image: {
    type: String,
    default: "https://ev.12joursdaction.com/storage/app/logos/none.png",
  },
  date:{type: Date },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
    formattedAddress: String,
  },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [
    {
      message: String,
      author: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
