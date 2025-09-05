using Eventura.Server.Core.Auth.Commands;
using Eventura.Server.Core.Auth.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eventura.Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator) => _mediator = mediator;

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest dto) =>
            Ok(await _mediator.Send(new RegisterCommand(dto)));

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest dto) =>
            Ok(await _mediator.Send(new LoginCommand(dto)));

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> Refresh([FromBody] string refreshToken) =>
            Ok(await _mediator.Send(new RefreshTokenCommand(refreshToken)));

        [Authorize]
        [HttpGet("me")]
        public ActionResult<UserInfo> Me()
        {
            var id = int.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0"
            );
            var name = User.Identity?.Name ?? "";
            var email =
                User.Claims.FirstOrDefault(c =>
                    c.Type == System.Security.Claims.ClaimTypes.Email || c.Type == "email"
                )?.Value
                ?? "";
            var role =
                User.Claims.FirstOrDefault(c =>
                    c.Type == System.Security.Claims.ClaimTypes.Role
                )?.Value
                ?? "User";

            return new UserInfo(id, name, email, role);
        }
    }
}
