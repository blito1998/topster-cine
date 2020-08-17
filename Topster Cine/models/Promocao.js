const db = require("./db")

const Promocao = db.connection.define("promocoes", {
    promocao: {
        type: db.Sequelize.STRING
    },
    produtoID: {
        type: db.Sequelize.INTEGER
    },
    preco: {
        type: db.Sequelize.FLOAT
    },
})

Promocao.sync()

module.exports = Promocao