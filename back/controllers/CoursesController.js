const { firebase, db } = require("../db");
const validator = require("../helper/validate");
const { CousreCreate } = require("../middelware/validation-middelware");


const createCourse = async (req, res, next) => {
  await validator(req.body, CousreCreate, {}, async (err, status) => {
    if (!status) {
      res.status(412).send({
        status: 412,
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      try {
        const { title, content, nbChapter, attendees } = req.body;
        await db.collection("courses").doc().set({
          title,
          content,
          nbChapter,
          // attendees
        });

        res.status(200).send({
            status:200,
            success:true,
            message:"Cousrse added successfuly",
           
        });
      } catch (err) {
        res.status(400).send({   
            status:400,          
            success:false,
            message: `${err.code} - ${err.message}` });
      }
    }
  });
}

const attendCourse = async (req, res, next) => {
    try{
        const { idUsers,idCourse } = req.params;
        const attendingRef = await db.doc(`users/${idUsers}/attending/${idCourse}`)
        const userData = await db.collection('users').doc(idUsers).get()

        const attendeeRef = await db.doc(`courses/${idCourse}/attendees/${idUsers}`)
        const courseData = await db.doc(`courses/${idCourse}`).get()
      
        const batch = db.batch();
        batch.set(attendingRef, courseData.data());
        batch.set(attendeeRef, userData.data());
        await batch.commit();

        res.status(200).send({             
          status:200,
          success:true,
          message: `user affected to course successfully`,
           });
    }
    catch(err)
    {
        res.status(400).send({             
            status:400,
            success:false,
            message: `${err.code} - ${err.message}` });
    }
}

const CourseWithUser = async (req, res, next) => {
    try{
      const {idCourse} = req.params

      const course = await db.doc(`courses/${idCourse}`).get().data();

      const usersIds = await db.collection(`courses/${idCourse}/attendees`).get();


      const userDocs = await Promise.all(
        usersIds.docs.map(doc => db.doc(`courses/${idCourse}/attendees/${doc.id}`).get())
      )


      var users = userDocs.filter(doc => doc.exists).map(doc => ({ id: doc.id, ...doc.data()}));
      var data={
        ...course,
        attendees:users
      }
        res.status(200).send({             
          status:200,
          success:true,
          message: `user affected to course successfully`,
          data:data
           });
    }
    catch(err)
    {
        res.status(400).send({             
            status:400,
            success:false,
            message: `${err.code} - ${err.message}` });
    }
}

module.exports = {
  createCourse,
  attendCourse,
  CourseWithUser
};
