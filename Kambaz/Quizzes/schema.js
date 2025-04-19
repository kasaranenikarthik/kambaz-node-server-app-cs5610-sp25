import mongoose from "mongoose";
 
const quizSchema = new mongoose.Schema( 
{ 
    _id: String, 
    course: { type: String, ref: "CourseModel" },
    grade: Number, 
    letterGrade: String, 
    enrollmentDate: Date, 
    published: Boolean,
  }, 
  { collection: "quizzes" } 
 ); 
 export default quizSchema; 