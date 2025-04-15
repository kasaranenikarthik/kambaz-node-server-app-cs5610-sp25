import model from "./model.js";

export async function findCoursesForUser(userId) {
  //console.log("Finding courses for user: ", userId); 
  const enrollments = await model.find({ user: userId }).populate("course"); 
  //console.log("Enrollments: ", enrollments);
  return enrollments.map((enrollment) => enrollment.course); 
 } 

 export async function findUsersForCourse(courseId) { 
  const enrollments = await model.find({ course: courseId }).populate("user"); 
  return enrollments.map((enrollment) => enrollment.user); 
 } 

 export function enrollUserInCourse(user, course) { 
  return model.create({ user, course, _id: `${user}-${course}` }); 
 } 

 export function unenrollUserFromCourse(user, course) { 
  return model.deleteOne({ user, course }); 
 } 