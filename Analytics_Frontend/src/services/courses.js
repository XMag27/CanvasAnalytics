import apiClient from "../api/apiClients";

export async function getCourses() {
  return await apiClient.get("/Courses");
}

export async function getStudentsByCourseId(course_id) {
  return await apiClient.get(`Courses/${course_id}/students`);
}

export async function getAssignmentsByCourseId(course_id) {
  return await apiClient.get(`Courses/${course_id}/assignments`);
}

export async function getStudentsGradeByCourseIdAndTaskId(course_id, task_id) {
  return await apiClient.get(`Courses/${course_id}/tasks/${task_id}/grades`);
}

export async function getSubmissionHistogramByCourseIdAndTaskId(
  course_id,
  task_id
) {
  return await apiClient.get(
    `Courses/${course_id}/tasks/${task_id}/submission-histogram`
  );
}

export async function getAnalyticsByCourseIdAndAssignmentId(
  course_id,
  assignment_id
) {
  return await apiClient.get(
    `Courses/${course_id}/assignments/${assignment_id}/analytics`
  );
}

export async function sendReminder(data) {
  return await apiClient.post("/Courses/send-message", data);
}

export async function getAveragesAssignmentsByCourseId(course_id) {
  return await apiClient.get(`Courses/${course_id}/assignments`);
}

export async function getGradesByStudentIdAndCourseId(course_id, student_id) {
  return await apiClient.get(
    `Courses/${course_id}/students/${student_id}/grades`
  );
}
