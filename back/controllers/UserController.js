const { firebase, db } = require("../db");
const bcrypt = require("bcrypt");
const validator = require("../helper/validate");
const { updateUser } = require("../middelware/validation-middelware");
const jwt_decode = require("jwt-decode");
const { mapUser } = require("../helper/utils");


const getAllUsers = async function (req, res, next) {
  try {
    const listUsers = await firebase.auth().listUsers();

    const users = listUsers.users.map(mapUser);
    return res.status(200).send({
      status: 200,
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  }
};

const deleteAllUsers = async function (req, res, next) {
  try {
    const listUsers = await firebase.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    let listuid = [];
    for (const i of users) {
      const batch = db.batch();
      batch.delete(i.uid);
      await batch.commit();
      listuid.push(i.uid);
    }
    await firebase.auth().deleteUsers(listuid);
    
    return res.status(200).send({
      status: 200,
      success: true,
      message: "all auth users deleted successfuly",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  }
}

const getOneUser = async function (req, res) {
  try {
    const { id } = req.params;
    const user = await db.doc(`users/${id}`).get();
    return res.status(200).send({
      status: 200,
      success: true,
      data: user.data(),
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  }
};

const UpdateUser = async function (req, res) {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    await validator(req.body, updateUser, {}, async (err, status) => {
      if (!status) {
        res.status(422).send({
          status: 422,
          success: false,
          message: "Validation failed",
          data: err,
        });
      } else {
        await firebase.auth().updateUser(id, { email });
        // await firebase.auth().setCustomUserClaims(id, { role })
        const user = await firebase.auth().getUser(id);
        res.status(200).send("user updated successfully");
      }
    });
  } catch (err) {
    res.status(400).send({ message: `${err.code} - ${err.message}` });
  }
};

const DeleteUser = async function (req, res) {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    await firebase.auth().deleteUser(id);
    return res.status(200).send("user deleted successfully");
  } catch (err) {
    res.status(400).send({ message: `${err.code} - ${err.message}` });
  }
};

const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await db.collection("students").doc(id).get();
    if (data.exists) {
      res.send(data.data());
    } else {
      res.status(404).send("No student found");
    }
  } catch (err) {
    res.status(400).send({ message: `${err.code} - ${err.message}` });
  }
};

const getAllStudent = async (req, res) => {
  try {
    await db
      .collection("users")
      .get()
      .then(
        (query) => {
          if (!query.empty) {
            // With the three dots you make clear to return a new data object as the one you declare with ‘const data’
            res
              .status(200)
              .send(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          } else {
            res.status(404).send("no data found");
          }
        },
        (e) => {
          console.error(e.message);
        }
      );
  } catch (err) {
    res.status(400).send({ message: `${err.code} - ${err.message}` });
  }
};

const updateStudent = async (req, res, next) => {

    await validator(req.body, updateUser, {}, async (err, status) => {
      if (!status) {
        res.status(412).send({
            status: 412,
          success: false,
          message: "Validation failed",
          data: err,
        });
      } else {
        let {firstName,lastName,role}=req.body
        const id = req.params.id;
        let data={}
        if (firstName) data.firstName = firstName;
        if (lastName ) data.lastName = lastName;
        if (role ) data.role = role;
    const student = await db.collection("users").doc(id);
   
    await student.update(data);
    const user = await db.collection("users").doc(id).get();
   
    res.status(200).send({ 
      status:200,      
      success: true,
      data:{ 
        id,
        ...user.data()
      },
      message: `Student record updated successfuly` });
      
    
  }

    
})
}

const deleteStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    await db.collection("students").doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const UserWithCourse = async (req, res, next) => {
  try {
    const { idUser } = req.params;

    const user = await (await db.doc(`users/${idUser}`).get()).data();

    const coursesIds = await db.collection(`users/${idUser}/attending`).get();

    const courseDocs = await Promise.all(
      coursesIds.docs.map((doc) =>
        db.doc(`users/${idUser}/attending/${doc.id}`).get()
      )
    );

    var courses = courseDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    var data = {
      ...user,
      attendees: courses,
    };
    res.status(200).send({
      status: 200,
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  }
};

const AllUsersCourses = async (req, res, next) => {
  try {
    await db
      .collection("users")
      .get()
      .then(async (query) => {
        if (!query.empty) {
          let data = [];
          await Promise.all(
            query.docs.map(async (doc) => {
              const coursesIds = await db
                .collection(`users/${doc.id}/attending`)
                .get();

              const courseDocs = await Promise.all(
                coursesIds.docs.map((d) =>
                  db.doc(`users/${doc.id}/attending/${d.id}`).get()
                )
              );
              var courses = courseDocs
                .filter((j) => j.exists)
                .map((s) => ({ id: s.id, ...s.data() }));

              data.push({ id: doc.id, ...doc.data(), attending: courses });
            })
          );
          res.status(200).send({
            status: 200,
            success: true,
            data: data,
          });
        } else {
          res.status(404).send("no data found");
        }
      });
  } catch (err) {
    res.status(400).send({
      status: 400,
      success: false,
      message: `${err.code} - ${err.message}`,
    });
  }
};


module.exports = {
  getAllStudent,
  deleteStudent,
  updateStudent,
  getStudentById,
  getAllUsers,
  getOneUser,
  UpdateUser,
  DeleteUser,
  deleteAllUsers,
  UserWithCourse,
  AllUsersCourses,
};
