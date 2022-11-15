import User from "../models/User.js";

export const getUser = async(req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}



export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}



export const CreateUser = async(req, res) => {
    try {
        var Username = req.body.userName;
        var noRekening = req.body.noRekening;
        var status = req.body.status;
        var bankString = "Bank"
        
        if (status == bankString){
            var saldoAwal = 1000000
            User.create(
                {
                    userName: Username, 
                    noRekening: noRekening, 
                    status: status, 
                    saldo: saldoAwal
                }
            )
            .then(
                res.status(201).json({
                    msg: "User Registered"
                })
            )
            .catch(err => {
                res.send(err);
            });
        } else {
            var saldoAwal = 10000;
            User.findOne({
                where: {status: bankString}
            })
            .then((bankAccount)=>{
                if(bankAccount.saldo >= 10000){
                    var newSaldo = parseFloat(bankAccount.saldo - saldoAwal);
                    var saldoBank = {
                        saldo: newSaldo
                    }
                    // Mengurangi Saldo Bank
                    User.update(saldoBank,{
                        where: {
                            status: bankString
                        }
                    })
                    .then(
                        res.status(201)
                    )
                    .catch(err => {
                        res.send(err);
                    });
                    // Membuat User baru
                    User.create({
                        userName: Username, 
                        noRekening: noRekening, 
                        status: status, 
                        saldo: saldoAwal
                    })
                    .then(
                        res.status(201).json({
                            msg: "User Registered"
                        })
                    )
                    .catch(err => {
                        res.send(err);
                    });
                } else{
                    res.status(201).json({
                        msg: "Tidak bisa lagi mendaptar"
                    })
                }
            })
            .catch(err => {
                res.send(err);
            });
        }

    } catch (error) {
        console.log(error.message);
    }
}

export const UpdateUser = async(req, res) => {
    var idUser = req.params.id;
    var topup = parseFloat(req.body.saldo);
    var string = "Bank"
    var maxSupply = 2000000;

    User.findOne({
        where: { id: idUser }
    })
    .then(userTarget => {
        var topupSaldo = parseFloat(userTarget.saldo + topup);
        var topUpInput = {
            saldo: topupSaldo
        }
        User.findOne({
            where: {status: string}
        })
        .then(saldoBank=>{
            if(topup <= saldoBank.saldo){
                //Menambahkan Saldo Lama dan Jumlah TopUp
                User.update(topUpInput, {
                    where: { id: idUser }
                })
                .then(
                    res.status(201).json({
                        msg: "Top up Success"
                    })
                )
                .catch(err => {
                    res.send(err);
                });
    
                //Mengurangi Saldo Bank
                var bankString = "Bank";
                User.findOne({
                    where: {status: bankString}
                })
                .then((bankAccount)=>{
                    var newSaldo = parseFloat(bankAccount.saldo - topup);
                    var saldoBank = {
                        saldo: newSaldo
                    }
                    // Mengurangi Saldo Bank
                    User.update(saldoBank,{
                        where: {
                            status: bankString
                        }
                    })
                    .then(
                        res.status(201)
                    )
                    .catch(err => {
                        res.send(err);
                    });
                })
                .catch(err => {
                    res.send(err);
                });
            } else{
                res.status(201).json({
                    msg: "Saldo bank tidak mencukupi"
                })
            }     
        })
        .catch(err =>{
            res.send(err);
        })    
    })
    .catch(err => {
        res.send(err);
    });
}



export const DeleteUser = async(req, res) => {
    try {
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}