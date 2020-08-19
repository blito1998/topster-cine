const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Compra = new Schema({
    poltrona: {
        type: Number,
        require: true
    },
    filmeID: {
        type: Schema.Types.ObjectId,
        ref: "filmes",
        required: true
    },
    produtos: {
        type: Schema.Types.ObjectId,
        ref: "produtos",
        required: true
    }
})

mongoose.model("compras", Compra)
