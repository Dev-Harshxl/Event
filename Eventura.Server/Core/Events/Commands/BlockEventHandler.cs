using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class BlockEventHandler : IRequestHandler<BlockEventCommand, Unit>
{
    private readonly AppDbContext _db;
    public BlockEventHandler(AppDbContext db) => _db = db;

    public async Task<Unit> Handle(BlockEventCommand c, CancellationToken ct)
    {
        if (!c.IsAdmin) throw new UnauthorizedAccessException("Admin only.");

        var ev = await _db.Events.FirstOrDefaultAsync(e => e.Id == c.EventId, ct)
                 ?? throw new KeyNotFoundException("Event not found.");

        ev.IsBlocked = c.Block;
        await _db.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
