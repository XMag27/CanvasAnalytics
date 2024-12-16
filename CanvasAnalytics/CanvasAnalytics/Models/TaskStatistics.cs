namespace CanvasAnalytics.Models
{
    public class TaskStatistics
    {
        public string TaskName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int StudentsSubmitted { get; set; }
        public int StudentsNotSubmitted { get; set; }
        public List<SubmissionHistory> SubmissionHistory { get; set; }
    }

    public class SubmissionHistory
    {
        public DateTime Date { get; set; }
        public int Submissions { get; set; }
    }
}
