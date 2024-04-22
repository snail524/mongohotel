const mongoose = require('mongoose');

// 預設設定
const RoomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    rating: Number,
    createAt:{
        type: Date,
        default: Date.now,
        select: false
    }
},
{
    versionKey: false,
})

const Room = mongoose.model('Room' , RoomSchema);

module.exports = Room;
