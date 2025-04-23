import model from "./model.js";

export function findAttemptsForUser(userId) {
    return model.find({ user: userId });
}

export function createAttempt(attempt) {
    return model.create(attempt);
}

export function findAttemptbyId(attemptId) {
    return model.findById(attemptId);
}

export function fetchAttempt(cid, qid, userId) {
    console.log("fetchAttempt: ", cid, qid, userId);
    return model.find({ course: cid, quiz: qid, user: userId });
}

export function updateAttempt(cid, qid, attemptId, attempt) {
    return model.updateOne({ _id: attemptId }, { $set: attempt });
}