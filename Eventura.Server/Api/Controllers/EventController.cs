using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Eventura.Server.Core.Events.Commands;
using Eventura.Server.Core.Events.Queries;
using Eventura.Server.Core.Events.Dtos;

namespace Eventura.Server.Api.Controllers
{
    [ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;
    public EventsController(IMediator mediator) => _mediator = mediator;

    // PUBLIC: list events (unauth allowed). Admin may include blocked.
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<EventDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<EventDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] string? location,
        [FromQuery] int? userId,
        [FromQuery] bool includeBlocked = false,
        CancellationToken ct = default)
    {
        var isAdmin = User?.IsInRole("Admin") == true;
        var result = await _mediator.Send(
            new GetAllEventsQuery(category, from, to, location, userId, includeBlocked, isAdmin), ct);
        return Ok(result);
    }

    // PUBLIC: get single event
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EventDto>> GetById(int id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetEventByIdQuery(id), ct);
        return result is null ? NotFound() : Ok(result);
    }

    // AUTH: create own event
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<EventDto>> Create([FromBody] CreateEventCommand command, CancellationToken ct)
    {
        var userId = GetUserId();
        var cmd = command with { CreatedById = userId };
        var result = await _mediator.Send(cmd, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // AUTH: delete own event (admin can delete any)
    [Authorize]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var userId = GetUserId();
        var isAdmin = User.IsInRole("Admin");
        await _mediator.Send(new DeleteEventCommand(id, userId, isAdmin), ct);
        return NoContent();
    }

    // ADMIN: block/unblock event
    public record BlockEventDto(bool Block);
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:int}/block")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Block(int id, [FromBody] BlockEventDto body, CancellationToken ct)
    {
        await _mediator.Send(new BlockEventCommand(id, body.Block, true), ct);
        return NoContent();
    }

    // AUTH: RSVP to event
    public record RsvpBody(string? Status);
    [Authorize]
    [HttpPost("{id:int}/rsvp")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Rsvp(int id, [FromBody] RsvpBody body, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new RsvpToEventCommand(id, userId, body?.Status ?? "Going"), ct);
        return NoContent();
    }

    // AUTH: cancel RSVP
    [Authorize]
    [HttpDelete("{id:int}/rsvp")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> CancelRsvp(int id, CancellationToken ct)
    {
        var userId = GetUserId();
        await _mediator.Send(new CancelRsvpCommand(id, userId), ct);
        return NoContent();
    }

    // AUTH: attendees list (creator or admin)
    [Authorize]
    [HttpGet("{id:int}/attendees")]
    [ProducesResponseType(typeof(List<AttendeeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AttendeeDto>>> Attendees(int id, CancellationToken ct)
    {
        var requesterId = GetUserId();
        var isAdmin = User.IsInRole("Admin");
        var list = await _mediator.Send(new GetEventAttendeesQuery(id, requesterId, isAdmin), ct);
        return Ok(list);
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (claim == null) throw new UnauthorizedAccessException("User ID claim not found.");
        return int.Parse(claim.Value);
    }
}
}
