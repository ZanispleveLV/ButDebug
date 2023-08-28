const mongoose = require('mongoose');
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const banSchema = new Schema(
    {
        userId: reqString,
        guildId: reqString,
        reason: reqString,
        staffId: reqString,
        expires: Date,
    },
    {
        timestamps: true,
    }
)

const name = 'temp-bans'
 
module.exports = mongoose.models[name] || mongoose.model(name, banSchema);