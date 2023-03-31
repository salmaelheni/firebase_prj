const {firebase,db} = require("../db");
const Validator = require('validatorjs');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

// Tighten password policy
Validator.register('strict', value => passwordRegex.test(value),
    'password must contain at least one uppercase letter, one lowercase letter and one number');

Validator.registerAsync('exist', async function(value,  attribute, req, passes) {

    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = (column == "AddressEmail") ? `${column} has already been taken `: `${column} already in use`
    const emailExixt = await db.collection(table).where(column, '==', value).get()
    if ( ! emailExixt.empty) {
        passes(false,msg)
      }
      passes()
});
Validator.registerAsync('unique', async function(value,  attribute, req, passes) {

    if (!attribute) throw new Error('Specify Requirements i.e fieldName: unique:table,column');
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column } = attArr;
    let msg = (column == "email") ? `${column} has already been taken `: `${column} already in use`
    const emailExixt = await db.collection(table).where(column, '==', value).get()
    if ( ! emailExixt.empty) {
        passes(false,msg)
      }
      passes()
});


const RuleCreateAdmin = {
    // "email":{
    //     // "AddressEmail": "required|string|email|exist:emails,AddressEmail",
    //    "AddressEmail": "required|string|email|exist:email",
    // },
    "email":"required|string|email|unique:users,email",
    "role":"string|in:admin,manager",
    "firstName": "required|string",
    "lastName": "required|string",
    "password": "required|string|min:6|confirmed|strict",
}

const RuleCreateUser= {
    "email":{
        "AddressEmail": "required|string|email|exist:emails,AddressEmail",
    },
    "role":"string|in:user",
    "firstName": "required|string",
    "lastName": "required|string",
    "PhoneNumber": "required|integer",
    "dateInscription": "date",
    "subject": "in:math,francais,english,info",
    "semester": "integer",
    "age": "integer",
    "password": "required|string|min:6|confirmed|strict",
    "classEnrolled": "string",
}

const updateUser = {
    "role":"string|in:admin,manager",
    "firstName": "string",
    "lastName": "string",
}
const updateEmail = {
    "newEmail":"required|string|email|unique:users,email",
}
const updatepwd = {
    "email":"required|string|email",
}



const CousreCreate = {
    "title":"required|string",
    "content":"required|string",
    "nbChapter":"required|integer",
    // "attendees": RuleCreateUser
}
module.exports = {RuleCreateAdmin,RuleCreateUser,updateUser,CousreCreate,updateEmail,updatepwd};