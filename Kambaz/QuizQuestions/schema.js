import mongoose from "mongoose";
 
const quizSchema = new mongoose.Schema( 
{ 
    _id: String, 
    quiz: { type: String, ref: "QuizModel"},
    question: String,
    answer: String,
    type: String, 
  }, 
  { collection: "quizQuestions" } 
 ); 
 export default quizSchema; 