using System.ComponentModel.DataAnnotations;

public class Rsvp
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    [Required]
    public int EventId { get; set; }
    public Event Event { get; set; } = default!;

    public DateTime RsvpDate { get; set; } = DateTime.UtcNow;

    [MaxLength(20)]
    public string Status { get; set; } = "Going"; // could be Going, Interested, etc.
}
