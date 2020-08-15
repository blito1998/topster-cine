const db = require("./db")

const Compra = db.connection.define("compras", {
    poltrona: {
        type: db.Sequelize.INTEGER
    },
    filme: {
        type: db.Sequelize.INTEGER
    },
    combos: {
        type: db.Sequelize.INTEGER
    },
})

//Compra.sync({force: true})

module.exports = Compra
