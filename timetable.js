const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    batch: { type: String, required: true },
    teacher: { type: String, required: true },
    classroom: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true }
});

module.exports = mongoose.model('Timetable', timetableSchema);