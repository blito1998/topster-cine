const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Poltrona = new Schema({
    nomePoltrona: {
        type: String,
        required: true
    },
    salaId: {
        type: Schema.Types.ObjectId,
        ref: "salas",
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Livre"
    }
})

mongoose.model("poltronas", Poltrona)