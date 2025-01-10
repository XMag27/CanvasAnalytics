using Newtonsoft.Json;

namespace CanvasAnalytics.Models
{
    public class User
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
        
        [JsonProperty("sortable_name")]
        public string SortableName { get; set; }

        [JsonProperty("short_name")]
        public string ShortName { get; set; }

        [JsonProperty("login_id")]
        public string LoginId { get; set; }
    }
}
