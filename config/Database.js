import {Sequelize} from "sequelize";

const db = new Sequelize('payment_db', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;