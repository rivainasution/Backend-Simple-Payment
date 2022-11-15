import {Sequelize} from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

const User = db.define('user',{
    userName: DataTypes.STRING,
    noRekening: DataTypes.INTEGER,
    status: DataTypes.STRING,
    saldo: DataTypes.FLOAT
},{
    freezeTableName: true
})

export default User;

(async()=>{
    await db.sync();
})();