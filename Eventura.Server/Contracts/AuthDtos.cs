public record RegisterRequest(string Name, string Email, string Password, string ConfirmPassword);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string AccessToken, string? RefreshToken = null);
public record UserInfo(int Id, string Name, string Email, string Role);
