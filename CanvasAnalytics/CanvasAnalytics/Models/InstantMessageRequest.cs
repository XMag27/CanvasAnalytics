namespace CanvasAnalytics.Models
{
    public class InstantMessageRequest
    {
        public int UserId { get; set; } // ID del usuario destinatario
        public string Subject { get; set; } // Asunto del mensaje
        public string Body { get; set; } // Cuerpo del mensaje
    }
}
