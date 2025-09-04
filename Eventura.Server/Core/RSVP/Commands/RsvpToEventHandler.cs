using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class RsvpToEventHandler : IRequestHandler<RsvpToEventCommand, Unit>
{
    private readonly AppDbContext _db;

    public RsvpToEventHandler(AppDbContext db) => _db = db;

    public async Task<Unit> Handle(RsvpToEventCommand c, CancellationToken ct)
    {
        var ev =
            await _db.Events.FirstOrDefaultAsync(e => e.Id == c.EventId, ct)
            ?? throw new KeyNotFoundException("Event not found.");

        if (ev.IsBlocked)
            throw new InvalidOperationException("Event is blocked.");

        var exists = await _db.Rsvps.AnyAsync(
            r => r.EventId == c.EventId && r.UserId == c.UserId,
            ct
        );
        if (exists)
            return Unit.Value; // idempotent

        _db.Rsvps.Add(
            new Rsvp
            {
                EventId = c.EventId,
                UserId = c.UserId,
                Status = string.IsNullOrWhiteSpace(c.Status) ? "Going" : c.Status.Trim(),
            }
        );

        await _db.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
