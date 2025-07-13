const mongoose = require("mongoose");
const fitSchema = new mongoose.Schema({
    "Name":{type:String},
    "User": {type:String},
    "Activity":{type:String},
    "Duration":{type:Number},
    "Date":{type:Date},

},{
    collection:"fitness"
})

fitSchema.statics.findByUser = function(user) {
    return this.find({ User: user });
};

module.exports = mongoose.model("fitSchema",fitSchema);







