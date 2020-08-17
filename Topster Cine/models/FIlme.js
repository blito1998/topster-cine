const db = require("./db")

const Filme = db.connection.define("filmes", {
    titulo: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    sinopse: {
        type: db.Sequelize.TEXT,
        allowNull: false
    },
    ano: {
        type: db.Sequelize.DATEONLY,
        allowNull: false
    },
    disponibilidade: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    diretor: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

Filme.sync()

module.exports = Filme