using Eventura.Server.Core.Auth.Dtos;
using Eventura.Server.Domain.Entities;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Core.Auth.Commands
{
    public class RegisterHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokens;

        public RegisterHandler(AppDbContext db, ITokenService tokens)
        {
            _db = db;
            _tokens = tokens;
        }

        public async Task<AuthResponse> Handle(RegisterCommand c, CancellationToken ct)
        {
            var dto = c.Request;

            if (dto.Password != dto.ConfirmPassword)
                throw new ArgumentException("Passwords do not match.");

            if (await _db.Users.AnyAsync(u => u.Email == dto.Email, ct))
                throw new ArgumentException("Email already registered.");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            var access = _tokens.CreateAccessToken(user);
            var refresh = _tokens.CreateRefreshToken();

            user.RefreshTokens.Add(
                new RefreshToken { Token = refresh, Expires = DateTime.UtcNow.AddDays(7) }
            );

            await _db.SaveChangesAsync(ct);

            return new AuthResponse(access, refresh);
        }
    }
}
