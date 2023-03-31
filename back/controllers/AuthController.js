const { firebase, db,firebase_client } = require("../db");
const bcrypt = require("bcrypt");
const validator = require("../helper/validate");
const {
  RuleCreateAdmin,
  RuleCreateUser,
  updatepwd,
  updateEmail

} = require("../middelware/validation-middelware");
const { createToken,createResponse } = require("../helper/utils");
const jwt_decode = require("jwt-decode");

const signupAdmin = async (req, res) => {
  await validator(req.body, RuleCreateAdmin, {}, async (err, status) => {
    if (!status) {
      res.status(412).send({
        status: 412,
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      let { firstName, lastName, password, email, role } = req.body;
    
      try {
        const { uid } = await firebase.auth().createUser({
          password,
          email,
        });
        await firebase.auth().setCustomUserClaims(uid, { uid, role });
        try {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);
          // await firebase
          //   .firestore()
          //   .collection("emails")
          //   .doc(AddressEmail)
          //   .set({
          //     AddressEmail,
          //   });
          await firebase.firestore().collection("users").doc(uid).set({
            firstName,
            lastName,
            password: hash,
            email,
            role,
          });
          const user = await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get();

          dataTokens = createToken(role, uid);
          dataTokens.then(async (dataTokens) => {
            await db
              .collection("tokens")
              .add({
                token: dataTokens.accessToken,
                refresh: dataTokens.refreshToken,
                exp: dataTokens.exp,
              })
              .then(async function (doc) {
                await db.doc(`users/${uid}/token/${doc.id}`).set( 
               {  token: dataTokens.accessToken,
                  refresh: dataTokens.refreshToken,
                  exp: dataTokens.exp}
                  );
                  return res.status(200).send({
                    status: 404,
                    success: false,
                    message: `added successffully `,
                    data :{token: dataTokens.accessToken, user: user.data()}
                  });
               }
               
               )
          });
        } catch (err) {
          res.status(404).send({
            status: 404,
            success: false,
            message: `error in adding user process -  ${err.message}`,
          });
        }
      } catch (err) {
        res.status(400).send({
          status: 412,
          success: false,
          message: `error in authentication process - ${err.code} - ${err.message}`,
        });
      }
    }
  });
  
};
const signupUser = async (req, res) => {
    await validator(req.body, RuleCreateUser, {}, async (err, status) => {
    if (!status) {
      res.status(412).send({
          status: 412,
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      let {
        firstName,
        lastName,
        password,
        email,
        role,
        PhoneNumber,
        dateInscription,
        subject,
        semester,
        age,
        classEnrolled,
      } = req.body;
      const AddressEmail = req.body.email.AddressEmail;
      try {
        const { uid } = await firebase.auth().createUser({
          password,
          email: AddressEmail,
        });
        await firebase.auth().setCustomUserClaims(uid, { uid, role });
        const token = await firebase
          .auth()
          .createCustomToken(uid, { email: AddressEmail, role: role });
        dataTokens = createToken(role, uid);
        dataTokens.then(async (dataTokens) => {
          await db.collection("tokens").doc().set({
            token: dataTokens.accessToken,
            refresh: dataTokens.refreshToken,
            exp: dataTokens.exp,
          });
          try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await firebase
              .firestore()
              .collection("emails")
              .doc(AddressEmail)
              .set({
                AddressEmail,
              });
            await firebase.firestore().collection("users").doc(uid).set({
              firstName,
              lastName,
              password: hash,
              email,
              role,
              PhoneNumber,
              dateInscription,
              subject,
              semester,
              age,
              classEnrolled,
            });
            const user = await firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .get();
            return res.status(200).send({ token: token, user:{ id: doc.id, ...user.data()} });
          } catch (err) {
            res.status(404).send({
              status: 404,
              success: false,
              message: `error in adding user process - ${err.code} - ${err.message}`,
            });
          }
        });
      } catch (err) {
        res.status(400).send({
          status: 412,
          success: false,
          message: `error in authentication process - ${err.code} - ${err.message}`,
        });
      }
    }
  });
};

const refreshTokenAccess = async function (req, res) {
  refresh_token = req.body.refresh;
  await db
    .collection("tokens")
    .where("refresh", "==", refresh_token)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const decodedToken = jwt_decode(doc.data().token);

        NewToken = createToken(decodedToken.uid, decodedToken.claims.role);

        NewToken.then(async (NewToken) => {
          console.log(NewToken.token);
          await db.collection("tokens").doc(doc.id).update({
            token: NewToken.accessToken,
            refresh: NewToken.refreshToken,
            exp: NewToken.exp,
          });
          res.status(200).send({
            message: "token refreshed successfully",
            data: NewToken,
          });
        });
      });
    })
    .catch((err) => {
      res.status(404).send("refresh token not valid");
    });
};

// const ResetPassword = async function (req, res)  {
//   email=req.body.email;
//   try{
//     console.log(firebase.auth())
//     await firebase.auth().languageCode.sendPasswordResetEmail(email).then(function() {
//       // Email sent.
//       res.status(200).send({
//         status: 200,
//         success: true,
//         message: `Email sent successfully`,
//       });
//     }).catch(function(err) {
//       res.status(400).send({
//         status: 400,
//         success: false,
//         message: `${err.code} - ${err.message}`,
//       });
//     });
//   }catch(err){
//     res.status(400).send({
//       status: 400,
//       success: false,
//       message: `${err.code} - ${err.message}`,
//     });
//   }
// }


// const signIn = async function (req, res)  {
//   let {email,password} = req.body
// const auth = firebase.auth() ;
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     console.log(user)
//     res.status(200).send({
//       status: 200,
//       success: true,
//       data: user,
//     });
    
//   })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  // });
// }
const signIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  firebase_client.auth().signInWithEmailAndPassword(email, password)
  .then(async(decodedIdToken) => {

      await db.collection("users").where("email", "==",email).get().then(function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        const userData = (doc.data());
        const uiduser = (doc.id);
        await db.collection(`users/${uiduser}/token`).get().then(function (tokendata) {
      
          
          tokendata.forEach(async function (doctoken) {

            
           const user_role = userData.role
            dataTokens = createToken(user_role, uiduser);
            
            dataTokens.then(async (data) => {
        
              await db.collection("tokens").doc(doctoken.id)
                .update({
                  token: data.accessToken,
                  refresh: data.refreshToken,
                  exp: data.exp,
                })
                .then(async function (doc) {
             console.log("dddd");
                  await db.doc(`users/${uiduser}/token/${doctoken.id}`).update( 
                 {  token: data.accessToken,
                    refresh: data.refreshToken,
                    exp: data.exp}
                    );
                 });
              })

            const token = (doctoken.data());
          if (decodedIdToken.user.emailVerified) {
            return  res.status(200).send({
              status: 200,
              success: false,
              message: `signed in succ..`,
              data:{ token: token,user:{
                id:uiduser,
                ...userData
              }}
            });
       
          } else {
      
            await firebase_client.auth().currentUser.sendEmailVerification();
            return  res.status(200).send({
              status: 200,
              success: false,
              message: `Email verification sent to ${decodedIdToken.user.email}`,
              data:{ user:userData}
            });
          }
      })
    })
  })
})
.catch((err) => {
    // The sign-in failed.
    return  res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });

  });
}).catch((err) => {
  // The sign-in failed.
  return  res.status(400).send({
    status: 400,
    success: false,
    message: `${err.code} - ${err.message}`,
  });

});
}

const signOut = async (req,res) => {

  await firebase_client.auth().signOut().then(function() {
    return  res.status(200).send({
      status: 200,
      success: true,
      message: `user signed out successfully`,
    })
  }).catch((err)=>{
    return  res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  });;
};

const ResetPassword = async (req,res) => {
  await validator(req.body, updatepwd, {}, async (err, status) => {
    if (!status) {
      res.status(412).send({
          status: 412,
        success: false,
        message: "Validation failed",
        data: err,
      });
    } 
    else {
  const email = req.body.email
        firebase_client.auth().sendPasswordResetEmail(email);
        try{
        return res.status(200).send(createResponse(200, true, 'Email sent successfully'));
    }catch(error){
      console.log(error);
    }
  }
})
}

const resetEmail = async function(req, res){
  try {
    await validator(req.body, updateEmail, {}, async (err, status) => {
      if (!status) {
        res.status(412).send({
            status: 412,
          success: false,
          message: "Validation failed",
          data: err,
        });
      } 
      else {
        const newEmail = req.body.newEmail;
          const idToken = res.data.decodedToken;
          
          await firebase.auth().verifyIdToken(idToken).then(async(decodedIdToken) => {
              var currentUser = decodedIdToken;
              console.log(currentUser);
              currentUser.updateEmail(newEmail).then(() => {
                 return res.status(200).send(createResponse(200, true, 'Email updated successfully'));
                })
        })

  }
})
}
  catch(error){
    return res.status(400).send(errorResponse(400, false, error.message));

  };
}

module.exports = {
  ResetPassword,
  signupAdmin,
  signupUser,
  refreshTokenAccess,
  signIn,
  signOut,
  resetEmail
};
