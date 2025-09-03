using Eventura.Server.Core.Auth.Dtos;
using MediatR;

namespace Eventura.Server.Core.Auth.Commands
{
    public record RefreshTokenCommand(string Token) : IRequest<AuthResponse>;
}
