using System.ComponentModel.DataAnnotations;

public class FeedbackForm
{
    [Required]
    public int Rating { get; set; }

    [MaxLength(250)]
    public string? Comment { get; set; }

    // allow up to 3 images
    public List<IFormFile>? Images { get; set; }
}
