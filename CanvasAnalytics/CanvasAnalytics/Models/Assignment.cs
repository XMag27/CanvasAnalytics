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
    }
}
