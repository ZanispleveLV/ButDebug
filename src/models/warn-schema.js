const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const warningSchema = new Schema(
    {
        userId: reqString,
        guildId: reqString,
        reason: reqString,
        staffId: reqString,
    },
    {
        timestamps: true,
    }
);

const name = 'warns'

module.exports = mongoose.models[name] || mongoose.model(name, warningSchema);