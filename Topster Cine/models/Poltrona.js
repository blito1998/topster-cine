const db = require("./db")

const Poltrona = db.connection.define("poltronas", {
    nomePoltrona: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    salaId: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "salas",
            key: "id"
        }
    },
    status: {
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: "Livre"
    }
})

Poltrona.associate = (models) => {
    Poltrona.belongsTo(models.Sala, { foreignKey: "salaId", as: "sala" })
}

Poltrona.sync()

module.exports = Poltrona