
const { firebase } = require("../db");


const sendNotif = async (req, res) => {
    const order = 'phone'
    new Promise(function(resolve) {
        console.log("Order is being processed");
        return res.status(200).send(resolve(`Your ${order} has been delivered :)`));
       })
};



module.exports = {
  sendNotif,
};