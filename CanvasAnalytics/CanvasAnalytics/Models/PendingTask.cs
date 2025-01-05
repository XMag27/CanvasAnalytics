namespace CanvasAnalytics.Models
{
    public class PendingTask
    {
        public int CourseId { get; set; }
        public int AssignmentId { get; set; }
        public string AssignmentName { get; set; }
        public DateTime? DueDate { get; set; }
        public string WorkflowState { get; set; }
        public double CompletionPercentage { get; set; }
        public bool IsSubmitted { get; set; }
    }

}
