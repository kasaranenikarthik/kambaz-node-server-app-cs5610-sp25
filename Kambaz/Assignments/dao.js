import model from "./model.js";

export function findAssignmentsForCourse(courseId) {
  return model.find({course : courseId});
}

export async function updateAssignment(assignmentId, assignment){
  //use model
  let a = await model.findOne({ _id: assignmentId });
  if (a){
    await model.updateOne({ _id: assignmentId }, assignment);
    return a;
  }
  return null;
}

export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });

}

export function createAssignment(assignment) {
  return model.create(assignment);
}