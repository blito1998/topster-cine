const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },  
    senha: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tipoUser: {
        type: String,
        required: true,
        default: "User"
    },
    verificado: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("usuarios", Usuario)