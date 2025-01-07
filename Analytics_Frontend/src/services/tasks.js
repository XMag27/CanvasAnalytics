import apiClient from "../api/apiClients";

export async function getHistoryTaskById(task_id) {
  return await apiClient.get(`Tasks/${task_id}`);
}
