const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { 
    type: String, 
    required: true
},
  last_name: { 
    type: String, 
    required: true
},
  username: { 
    type: String, 
    required: true 
},
  password: { 
    type: String, 
    required: true 
},
  membership_status: { 
    type: Boolean, 
    required: true
}, 
  admin_status: {
        type: Boolean, 
        required: false
}
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
     return this.first_name + ' ' + this.last_name;
});

// // Virtual for user's URL
// UserSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/${this._id}`;
// });

// Export model
module.exports = mongoose.model("User", UserSchema);
