import model from "./model.js";

export async function findQuizzesForCourse(courseId) {
    const quizzes = await model.find({ course: courseId });
    return quizzes;
}

export async function publishQuiz(courseId, quizId) {
    const quiz = await model.findById(quizId);
    if (!quiz) {
        throw new Error("Quiz not found");
    }
    else {
        await model.updateOne(
            { _id: quizId, course: courseId },
            { $set: { published: true } }
        );
    }
    return await model.findById(quizId);
}

export async function unPublishQuiz(courseId, quizId) {
    const quiz = await model.findById(quizId);
    if (!quiz) {
        throw new Error("Quiz not found");
    } else {
        await model.updateOne(
            { _id: quizId, course: courseId },
            { $set: { published: false } }
        );
    }
    return await model.findById(quizId);;
}