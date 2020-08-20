const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Promocao = new Schema({
    promocao: {
        type: String,
        required: true
    },
    produtoID: [{
        type: Schema.Types.ObjectId,
        ref: "produtos",
        required: true
    }],
    preco: {
        type: Number,
        required: true
    },
})

mongoose.model("promocoes", Promocao)