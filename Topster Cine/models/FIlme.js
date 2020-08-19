const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Filme = new Schema({
    titulo: {
        type: String,
        required: true
    },
    sinopse: {
        type: String,
        required: true
    },
    ano: {
        type: Date,
        required: true
    },
    disponibilidade: {
        type: String,
        required: true,
        default: "Em Breve"
    },
    diretor: {
        type: String,
        required: true
    }
})

mongoose.model("filmes", Filme)