import { Sequelize } from "sequelize";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getTransaction = async(req, res) => {
    try {
        const response = await Transaction.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}


export const CreateTransaction = async(req, res) => {
    var userPengirim = req.body.noRekPengirim;
    var userPenerima = req.body.noRekPenerima;
    var nominalTransfer = parseFloat(req.body.jumlahTransfer);
    var tanggal = req.body.tanggalTransfer;

    Transaction.findOne({
        where: { noRekPengirim: userPengirim }
    })
    .then(userSender => {
        User.findOne({
            where: { noRekening: userPengirim }
        })
        .then(updatedUser => {
            if(nominalTransfer <= updatedUser.saldo){
                var saldoBaru = parseFloat(updatedUser.saldo - nominalTransfer);
                var topUpInput = {
                    saldo: saldoBaru
                }
                User.update(topUpInput, {
                    where: { noRekening: userPengirim }
                })
                .then(updatedUser => {
                    Transaction.findOne({
                        where: { noRekPenerima: userPenerima }
                    })
                    .then(userReceiver => {
                        User.findOne({
                            where: { noRekening: userPenerima }
                        })
                        .then(saldoPenerima => {
                            var saldoBaru = parseFloat(saldoPenerima.saldo + nominalTransfer);
                            var topUpInput = {
                                saldo: saldoBaru
                            }
                            User.update(topUpInput, {
                                where: { noRekening: userPenerima }
                            })
                            .then(updatedUser => {
                                Transaction.create(
                                    {
                                        noRekPengirim: userPengirim, 
                                        noRekPenerima: userPenerima, 
                                        jumlahTransfer: nominalTransfer, 
                                        tanggalTransfer: tanggal
                                    }
                                )
                                .then(transaction => {
                                    res.status(201).json({msg: "Transaction Success"});
                                })
                                .catch(err => {
                                    res.send(err);
                                });
                            })
                            .catch(err => {
                                res.send(err);
                            });
                
                        })
                        .catch(err => {
                            res.send(err);
                        });
                    })
                    .catch(err => {
                    res.send(err);
                    });
                })
                .catch(err => {
                    res.send(err);
                });
            } else{
                res.json({
                    info: "Saldo Tidak Mencukupi",
                });
            }

        })
        .catch(err => {
            res.send(err);
        });
    })
    .catch(err => {
      res.send(err);
    });
}

// export const Transfer = async(req, res) => {
//     var pengirim = req.body.noRekPengirim;
//     var penerima = req.body.noRekPenerima;
//     var nominalTransfer = parseFloat(req.body.jumlahTransfer);
//     var tanggal = req.body.tanggalTransfer;

//     User.findAll({
//         where: { noRekening: pengirim}
//     })
//     .then(idPengirim =>{
//         User.findAll({
//             where: {noRekening: penerima}
//         })
//         .then(idPenerima =>{
//             // Jika uang yang ditransfer lebih kecil dari saldo
//             if(nominalTransfer <= idPengirim.saldo){
//                 //Mengurangi saldo pengirim dan menambah saldo penerima
//                 var saldoPengirim = parseFloat(idPengirim.saldo - nominalTransfer);
//                 var saldoPenerima = parseFloat(idPenerima.saldo + nominalTransfer);

//                 var saldoBaruPengirim = {
//                     saldo: saldoBaru
//                 }
//             } else{
//                 res.json({
//                     info: "Saldo Tidak Mencukupi",
//                 });
//             }
//         })
//         .catch(err => {
//             res.send(err);
//         });
//     })
//     .catch(err => {
//         res.send(err);
//     });
// }

export const DeleteTransaction = async(req, res) => {
    try {
        await Transaction.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Transaction Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}

export const Total = async (req, res) => {
    User.findAll({
        attributes: [
            [Sequelize.fn("SUM", Sequelize.cast(Sequelize.col("saldo"), 'integer')), "totalAmount"] 
        ]
    })
    .then(data => {
        res.json({
            total: data

        })
    })
    .catch(err => {
        res.send(err)
    });
}


