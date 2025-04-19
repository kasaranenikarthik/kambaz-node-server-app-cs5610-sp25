import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {

  const deleteUser = async (req, res) => { 
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => { 
    const currentUser = req.session["currentUser"];
    console.log("Current User: ", currentUser);
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role); 
      res.json(users); 
      return; 
    } 
    if (name) { 
      const users = await dao.findUsersByPartialName(name); 
      res.json(users); 
      return; 
    }

    const users = await dao.findAllUsrs(); 
    
    res.json(users); 
  };

  const findUserById = async (req, res) => { 
    const user = await dao.findUserById(req.params.userId); 
    res.json(user);
  };

  const updateUser = async (req, res) => { 
    const userId = req.body._id;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = await dao.findUserById(userId);
    res.json(currentUser);
  };

  const signup = async (req, res) => { 
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    } else {
      await dao.createUser(req.body);
      const currentUser = await dao.findUserByUsername(req.body.username);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    }
    
  };

  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser){
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
   };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.json(currentUser);
   };

   const findCoursesForUser = async (req, res) => { 
    const currentUser = req.session["currentUser"];
    //console.log("Current User: ", currentUser); 
    if (!currentUser) { 
      res.sendStatus(401); 
      return; 
    } 
    if (currentUser.role === "ADMIN") { 
      const courses = await courseDao.findAllCourses(); 
      res.json(courses); 
      return; 
    } 
    let { uid } = req.params;
    //console.log("User ID: ", uid);
    if (uid === "current") { 
      uid = currentUser._id; 
    } 
    const courses = await enrollmentsDao.findCoursesForUser(uid); 
    res.json(courses); 
  }; 

  const createCourse = (req, res) => {
    try {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
    } catch (e) {
      res.status(400).json({ message: "Unable to create course" });
    }
  }

  const enrollUserInCourse = async (req, res) => { 
    let { uid, cid } = req.params; 
    if (uid === "current") { 
      const currentUser = req.session["currentUser"]; 
      uid = currentUser._id; 
    } 
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid); 
    res.send(status); 
  }; 
  
  const unenrollUserFromCourse = async (req, res) => { 
    let { uid, cid } = req.params; 
    if (uid === "current") { 
      const currentUser = req.session["currentUser"]; 
      uid = currentUser._id; 
    } 
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid); 
    res.send(status); 
  }; 
  
  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse); 
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/current/course", createCourse);
}