const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Sala = new Schema({
    nomeSala: {
        type: String,
        required: true
    },
    capacidade: {
        type: Number,
        required: true
    }
})

mongoose.model("salas", Sala)