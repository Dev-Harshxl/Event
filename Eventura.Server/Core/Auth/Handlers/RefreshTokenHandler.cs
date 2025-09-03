using Eventura.Server.Core.Auth.Dtos;
using Eventura.Server.Domain.Entities;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Core.Auth.Commands
{
    public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokens;

        public RefreshTokenHandler(AppDbContext db, ITokenService tokens)
        {
            _db = db;
            _tokens = tokens;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand c, CancellationToken ct)
        {
            var stored = await _db.RefreshTokens
                .Include(r => r.User)
                .SingleOrDefaultAsync(r => r.Token == c.Token, ct);

            if (stored is null || stored.Expires < DateTime.UtcNow || stored.IsRevoked)
                throw new UnauthorizedAccessException("Invalid refresh token.");

            var access = _tokens.CreateAccessToken(stored.User);
            var newRefresh = _tokens.CreateRefreshToken();

            stored.IsRevoked = true;

            stored.User.RefreshTokens.Add(new RefreshToken
            {
                Token = newRefresh,
                Expires = DateTime.UtcNow.AddDays(7),
            });

            await _db.SaveChangesAsync(ct);

            return new AuthResponse(access, newRefresh);
        }
    }
}
