import {Sequelize} from 'sequelize';
import db from '../config/Database.js';

const {DataTypes} = Sequelize;

const Transaction = db.define('transaksi',{
    noRekPengirim: DataTypes.INTEGER,
    noRekPenerima: DataTypes.INTEGER,
    jumlahTransfer: DataTypes.FLOAT,
    tanggalTransfer: DataTypes.DATE
},{
    freezeTableName: true
})

export default Transaction;

(async()=>{
    await db.sync();
})();