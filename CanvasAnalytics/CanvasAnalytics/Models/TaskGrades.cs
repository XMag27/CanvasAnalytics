namespace CanvasAnalytics.Models
{
    public class TaskGrades
    {
        public int IdTarea { get; set; } // Id de la tarea
        public string NombreTarea { get; set; } // Nombre de la tarea
        public List<AssignmentAnalytics> Calificaciones { get; set; }
    }
}
