// 2nd Model i.e. Meeting

// We will keep record of "user_id" , "meeting_code" , "date" i.e. time of meeting in this Collection.

const mongoose = require("mongoose");

const Schema = mongoose.Schema;


// Creating Schema of Meeting Collection
const meetingSchema = new Schema({

    user_id: {
        type: String
    },

    meeting_Code: {
        type: String,
        required: true 
    },

    date: {
        type: Date,
        default: Date.now,
        required: true 
    }
});


// Creating Model and Collection of this Meething Schema
const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;





 