using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteEventHandler : IRequestHandler<DeleteEventCommand, Unit>
{
    private readonly AppDbContext _db;
    public DeleteEventHandler(AppDbContext db) => _db = db;

    public async Task<Unit> Handle(DeleteEventCommand c, CancellationToken ct)
    {
        var ev = await _db.Events.FirstOrDefaultAsync(e => e.Id == c.EventId, ct)
                 ?? throw new KeyNotFoundException("Event not found.");

        if (!(c.IsAdmin || ev.CreatedById == c.RequesterId))
            throw new UnauthorizedAccessException("You can delete only your own events.");

        _db.Events.Remove(ev);
        await _db.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
