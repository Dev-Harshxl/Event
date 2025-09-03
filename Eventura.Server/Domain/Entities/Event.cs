using System.ComponentModel.DataAnnotations;

public class Event
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    [Required]
    public DateTime EventDate { get; set; }

    // NEW
    public bool IsBlocked { get; set; } = false;

    [Required, MaxLength(250)]
    public string Location { get; set; } = default!;

    [Required, MaxLength(100)]
    public string Category { get; set; } = default!;

    // public string? ImageUrl { get; set; }

    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public string? ImageFileName { get; set; }

    // Relationships
    [Required]
    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = default!;

    public List<Rsvp> Rsvps { get; set; } = new();
}
