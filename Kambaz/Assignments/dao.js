import Database from "../Database/index.js";

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  const data = assignments.filter((assignment) => assignment.course === courseId);
  return data
}

export function updateAssignment(assignmentId, assignment) {
  const { assignments } = Database;
  const index = assignments.findIndex((assignment) => assignment._id === assignmentId);
  if (index !== -1) {
    assignments[index] = { ...assignments[index], ...assignment };
    return assignments[index];
  }
  return null;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  const index = assignments.findIndex((assignment) => assignment._id === assignmentId);
  if (index !== -1) {
    const deletedAssignment = assignments[index];
    assignments.splice(index, 1);
    return deletedAssignment;
  }
  return null;
}

export function createAssignment(assignment) {
  const { assignments } = Database;
  const newAssignment = {
    id: assignments.length + 1,
    ...assignment,
  };
  assignments.push(newAssignment);
  return newAssignment;
}