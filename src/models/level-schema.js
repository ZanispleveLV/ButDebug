const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const defNum = {
    type: Number,
    default: 0,
}

const levelSchema = new Schema({
    userId: reqString,
    guildId: reqString,
    xp: defNum,
    level: defNum,
});

const name = 'levels'

module.exports = mongoose.models[name] || mongoose.model(name, levelSchema);
