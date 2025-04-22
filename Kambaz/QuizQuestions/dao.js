import model from "./model.js";

export async function fetchQuizQuestions(quizId) {
    const quizQuestions = await model.find({ quiz: quizId});
    return quizQuestions;
}

export async function createQuizQuestion(quizQuestion) {
    console.log("quizQuestion", quizQuestion);
    const newQuizQuestion = await model.create(quizQuestion);
    return newQuizQuestion;
}

export async function updateQuizQuestion(cid, quizId, questionId, updatedQuizQuestion) {
    const uQuizQuestion = await model.updateOne({ _id: questionId, course:cid, quiz: quizId }, { $set: updatedQuizQuestion });
    return uQuizQuestion;
}

export async function deleteQuizQuestion(cid, quizId, questionId) {
    const deletedQuizQuestion = await model.deleteOne({ _id: questionId, quiz: quizId, course: cid });
    return deletedQuizQuestion;
}