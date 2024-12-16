﻿using Newtonsoft.Json;

namespace CanvasAnalytics.Models
{
    public class Submission
    {
        [JsonProperty("user_id")]
        public int UserId { get; set; }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("workflow_state")]
        public string WorkflowState { get; set; }

        [JsonProperty("submitted_at")]
        public DateTime? SubmittedAt { get; set; }

        [JsonProperty("score")]
        public double? Score { get; set; }
    }

}
