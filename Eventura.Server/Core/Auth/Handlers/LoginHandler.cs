using Eventura.Server.Core.Auth.Dtos;
using Eventura.Server.Domain.Entities;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Core.Auth.Commands
{
    public class LoginHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokens;

        public LoginHandler(AppDbContext db, ITokenService tokens)
        {
            _db = db;
            _tokens = tokens;
        }

        public async Task<AuthResponse> Handle(LoginCommand c, CancellationToken ct)
        {
            var dto = c.Request;

            var user = await _db.Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefaultAsync(u => u.Email == dto.Email, ct);

            if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials.");

            var access = _tokens.CreateAccessToken(user);
            var refresh = _tokens.CreateRefreshToken();

            user.RefreshTokens.Add(new RefreshToken
            {
                Token = refresh,
                Expires = DateTime.UtcNow.AddDays(7),
            });

            await _db.SaveChangesAsync(ct);

            return new AuthResponse(access, refresh);
        }
    }
}
