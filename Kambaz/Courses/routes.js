import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";

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
}

