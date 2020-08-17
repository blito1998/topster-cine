const db = require("./db")

const Sala = db.connection.define("salas", {
    nomeSala: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    capacidade: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    }
})

Sala.associate = (models) => {
    Sala.hasMany(models.Poltrona, { as: "salaPoltronas" })
}

Sala.sync()

module.exports = Sala