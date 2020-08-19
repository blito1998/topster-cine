const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Sessao = new Schema({
    horario: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    filmeID: {
        type: Schema.Types.ObjectId,
        ref: "filmes",
        required: true
    },
    salaID: {
        type: Schema.Types.ObjectId,
        ref: "salas",
        required: true
    }
})

mongoose.model("sessoes", Sessao)