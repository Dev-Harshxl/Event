using Eventura.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = default!;

    [Required, MaxLength(200)]
    public string Email { get; set; } = default!;

    [Required]
    public string PasswordHash { get; set; } = default!;

    [MaxLength(50)]
    public string Role { get; set; } = "User";

    // 👇 Navigation properties
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Rsvp> Rsvps { get; set; } = new List<Rsvp>();

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

}
