const Sequelize = require("sequelize")

const connection = new Sequelize("guiaperguntas", "root", "your_password", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection