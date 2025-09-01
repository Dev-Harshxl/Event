using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, ITokenService tokens) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest dto)
    {
        if (dto.Password != dto.ConfirmPassword)
            return BadRequest("Passwords do not match.");

        var exists = await db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return Conflict("Email already registered.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Created("", new UserInfo(user.Id, user.Name, user.Email, user.Role));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest dto)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
        if (user is null) return Unauthorized("Invalid credentials.");

        var ok = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!ok) return Unauthorized("Invalid credentials.");

        var access = tokens.CreateAccessToken(user);
        return new AuthResponse(access);
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<UserInfo> Me()
    {
        var name = User.Identity?.Name ?? "";
        var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email
                    || c.Type == "email")?.Value ?? "";
        var idStr = User.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value ?? "0";
        var role = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value ?? "User";

        int.TryParse(idStr, out var id);
        return new UserInfo(id, name, email, role);
    }
}
