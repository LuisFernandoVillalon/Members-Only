const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { 
    type: String, required: true
},
  timestamp: { 
    type: Date, required: true
},
  text: { 
    type: String, required: true 
},
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", required: true 
},
});

// Virtual for date
MessageSchema.virtual("standard_timestamp").get(function () {
  let time  = this.timestamp.getUTCHours() + ":" + this.timestamp.getUTCMinutes();
  let date = this.timestamp.getMonth()+1 + "/" + this.timestamp.getDate() + "/" + this.timestamp.getFullYear();
  return time + ' ' + date;
});
// Export model
module.exports = mongoose.model("Message", MessageSchema);
