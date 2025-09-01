using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

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
}
