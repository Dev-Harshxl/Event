using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAllEventsHandler : IRequestHandler<GetAllEventsQuery, List<EventDto>>
{
    private readonly AppDbContext _db;
    public GetAllEventsHandler(AppDbContext db) => _db = db;

    public async Task<List<EventDto>> Handle(GetAllEventsQuery q, CancellationToken ct)
    {
        var query = _db.Events.AsQueryable();

        if (!q.IsAdmin)
            query = query.Where(e => !e.IsBlocked);
        else if (!q.IncludeBlocked)
            query = query.Where(e => !e.IsBlocked);

        if (!string.IsNullOrWhiteSpace(q.Category))
            query = query.Where(e => e.Category == q.Category);

        if (!string.IsNullOrWhiteSpace(q.Location))
            query = query.Where(e => e.Location == q.Location);

        if (q.UserId.HasValue)
            query = query.Where(e => e.CreatedById == q.UserId.Value);

        if (q.From.HasValue)
            query = query.Where(e => e.EventDate >= q.From.Value);

        if (q.To.HasValue)
            query = query.Where(e => e.EventDate <= q.To.Value);

        return await query
            .OrderBy(e => e.EventDate)
            .Select(e => e.ToDto())
            .ToListAsync(ct);
    }
}
