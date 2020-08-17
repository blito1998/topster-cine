const db = require("./db")

const Usuario = db.connection.define("usuarios", {
    nome: {
        type: db.Sequelize.STRING,
        required: true
    },  
    senha: {
        type: db.Sequelize.STRING,
        required: true
    },
    email: {
        type: db.Sequelize.STRING,
        required: true
    },
    tipoUser: {
        type: db.Sequelize.STRING,
        required: true,
        defaultValue: "User"
    }   
})

Usuario.sync()

module.exports = Usuario