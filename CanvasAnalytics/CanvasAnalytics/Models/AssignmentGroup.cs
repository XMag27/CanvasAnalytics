using Newtonsoft.Json;

namespace CanvasAnalytics.Models
{
    public class AssignmentGroup
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonIgnore]
        public List<Assignment> Assignments { get; set; } = new();
    }

}
