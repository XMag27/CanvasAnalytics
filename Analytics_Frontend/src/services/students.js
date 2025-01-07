import apiClient from "../api/apiClients";

export async function getPendingTaskByStudentId(id) {
  return await apiClient.get(`StudentTasks/${id}/pending-tasks`);
}
