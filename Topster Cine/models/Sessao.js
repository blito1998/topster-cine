const db = require("./db")

const Filme = require("./Filme")
const Sala = require("./Sala")

const Sessao = db.connection.define("sessoes", {
    horario: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
})

Sala.belongsToMany(Filme, { through: Sessao })
Filme.belongsToMany(Sala, { through: Sessao })

Sessao.sync()

module.exports = Sessao