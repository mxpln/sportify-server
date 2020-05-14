const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectiveSchema = new Schema({
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Team = mongoose.model("Team", CollectiveSchema);

module.exports = Team;
