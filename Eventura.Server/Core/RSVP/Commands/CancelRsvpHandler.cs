using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class CancelRsvpHandler : IRequestHandler<CancelRsvpCommand, Unit>
{
    private readonly AppDbContext _db;
    public CancelRsvpHandler(AppDbContext db) => _db = db;

    public async Task<Unit> Handle(CancelRsvpCommand c, CancellationToken ct)
    {
        var rsvp = await _db.Rsvps.FirstOrDefaultAsync(r => r.EventId == c.EventId && r.UserId == c.UserId, ct);
        if (rsvp is null) return Unit.Value; // idempotent

        _db.Rsvps.Remove(rsvp);
        await _db.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
