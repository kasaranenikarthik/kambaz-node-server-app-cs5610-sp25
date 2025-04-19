import model from "./model.js";

export async function fetchQuizQuestions(quizId) {
    const quizQuestions = await model.find({ quiz: quizId});
    return quizQuestions;
}