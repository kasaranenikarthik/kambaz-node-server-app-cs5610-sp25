import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";
import * as quizzesDao from "../Quizzes/dao.js";
import * as quizQuestionsDao from "../QuizQuestions/dao.js";
import * as attemptsDao from "../Attempts/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  app.post("/api/courses", async (req, res) => { 
    const currentUser = req.session["currentUser"];
    const course = await dao.createCourse(req.body);
    if (currentUser)
    {
      await enrollmentDao.enrollUserInCourse(currentUser._id, course._id);
    } 
    res.json(course); 
  }); 

  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {...req.body, course: courseId};
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });


  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    //console.log("get all courses: ", courseId);
    //console.log("currentUser: ", req.session["currentUser"]);
    const assignments = await assignmentsDao.findAssignmentsForCourse(courseId);
    //console.log("assignments: ", assignments);
    res.json(assignments);
  });

  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    const { courseId } = req.params;
    const assignment = {...req.body, course: courseId};
    const newAssignment = await assignmentsDao.createAssignment(assignment);
    res.json(newAssignment);
  });

  app.put("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
    res.send(status);
  });

  app.delete("/api/courses/:courseId/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const status = await assignmentsDao.deleteAssignment(assignmentId);
    res.send(status);
  });


  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentDao.findUsersForCourse(cid);
    res.json(users);
  });

  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(cid);
    res.json(quizzes);
  });

  app.get("/api/courses/:cid/quiz/:qid/details", async (req, res) => {
    const {cid, qid } = req.params;
    const quizDetails = await quizzesDao.findQuizById(cid, qid);
    if (quizDetails.length === 1) {
      res.json(quizDetails[0]);
    } else {
      res.status(404).send("Duplicate or no Quiz not found");
    }
  });

  app.get("/api/courses/:cid/quiz/:qid", async (req, res) => {
    const {cid, qid } = req.params;
    const questions = await quizQuestionsDao.fetchQuizQuestions(qid);
    res.json(questions);
  });

  app.put("/api/courses/:cid/quiz/:qid", async (req, res) => {
    const {cid, qid } = req.params;
    const updatedQuiz = await quizzesDao.updateQuiz(cid, qid, req.body);
    res.json(updatedQuiz);
  });

  app.post("/api/courses/:cid/quiz/:qid", async (req, res) => {
    const {cid, qid } = req.params;
    const quiz = await quizzesDao.findQuizById(cid, qid);
    if (quiz.length !== 0) {
      res.status(400).send("Quiz already exists");
      return;
    }
    const newQuiz = await quizzesDao.createQuiz(cid, qid, req.body);
    res.json(newQuiz);
  });

  app.delete("/api/courses/:cid/quiz/:qid", async (req, res) => {
    const { cid, qid } = req.params;
    const status = await quizzesDao.deleteQuiz(cid, qid);
    res.json(status);
  });

  app.post("/api/courses/:cid/quiz/:qid/publish", async (req, res) => {
    const { cid, qid } = req.params;
    const q = await quizzesDao.publishQuiz(cid, qid);
    res.json(q);
  });

  app.post("/api/courses/:cid/quiz/:qid/unpublish", async (req, res) => {
    const { cid, qid } = req.params;
    const status = await quizzesDao.unPublishQuiz(cid, qid);
    res.json(status);
  });

  app.post("/api/courses/:cid/quiz/:qid/questions", async (req, res) => {
    const { cid, qid } = req.params;
    const newQuizQuestion = await quizQuestionsDao.createQuizQuestion(req.body);
    res.json(newQuizQuestion);
  });

  app.put("/api/courses/:cid/quiz/:qid/questions/:questionId", async (req, res) => {
    const { cid, qid, questionId } = req.params;
    console.log("questionId: ", questionId);
    console.log("req.body: ", req.body);
    const updatedQuizQuestion = await quizQuestionsDao.updateQuizQuestion(cid, qid, questionId, req.body);
    res.json(updatedQuizQuestion);
  });

  app.delete("/api/courses/:cid/quiz/:qid/questions/:questionId", async (req, res) => {
    const { cid, qid, questionId } = req.params;
    const status = await quizQuestionsDao.deleteQuizQuestion(cid, qid, questionId);
    res.json(status);
  });
  
  app.post("/api/courses/:cid/quiz/:qid/attempts", async (req, res) => {
    const { cid, qid} = req.params;
    const status = await attemptsDao.createAttempt(req.body);
    res.json(status);
  });

  app.get("/api/courses/:cid/quiz/:qid/attempts/:userId", async (req, res) => {
    //console.log("get all attempts: ", req.params);
    const { cid, qid, userId} = req.params;
    const response = await attemptsDao.fetchAttempt(cid, qid, userId);
    res.json(response);
  });

  app.put("/api/courses/:cid/quiz/:qid/attempts/:attemptId", async (req, res) => {
    const { cid, qid, attemptId} = req.params;
    //console.log("attemptId: ", attemptId);
    const status = await attemptsDao.updateAttempt(cid, qid, attemptId, req.body);
    res.json(status);
  });

}

