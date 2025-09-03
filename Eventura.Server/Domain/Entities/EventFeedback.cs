using System.ComponentModel.DataAnnotations;

namespace Eventura.Server.Domain.Entities
{
    public class EventFeedback
    {
        public int Id { get; set; }

        [Required]
        public int EventId { get; set; }
        public Event Event { get; set; } = default!;

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = default!;

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(250)]
        public string Comment { get; set; } = string.Empty;

        public byte[]? Image1 { get; set; }
        public string? Image1ContentType { get; set; }

        public byte[]? Image2 { get; set; }
        public string? Image2ContentType { get; set; }

        public byte[]? Image3 { get; set; }
        public string? Image3ContentType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
