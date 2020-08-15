const Sequelize = require("sequelize")

const connection = new Sequelize("Topster Cine", "sa", "serveradmin",{
    host: "localhost",
    dialect: "mssql"
})

module.exports = {
    Sequelize: Sequelize,
    connection: connection
}
