using Newtonsoft.Json;

namespace CanvasAnalytics.Models
{
    public class Assignment
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [JsonProperty("due_at")]
        public DateTime? DueDate { get; set; }

        [JsonProperty("points_possible")]
        public double PointsPossible { get; set; }
        
        [JsonProperty("workflow_state")]
        public string WorkflowState { get; set; }

        [JsonProperty("assignment_group_id")]
        public int AssignmentGroupId { get; set; }

        
    }
    public class AssignmentGroupAverage
    {
        public int AssignmentGroupId { get; set; }
        public string AssignmentGroupName { get; set; }
        public List<AssignmentAverage> Assignments { get; set; }
    }

    public class AssignmentAverage
    {
        public int AssignmentId { get; set; }
        public string AssignmentName { get; set; }
        public double AverageScore { get; set; }
    }
    public class AssignmentAnalytics
    {
        public int SubmissionId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public double? RawScore { get; set; }
        public double PointsPossible { get; set; }
        public double? WeightedScore { get; set; }
    }

}
