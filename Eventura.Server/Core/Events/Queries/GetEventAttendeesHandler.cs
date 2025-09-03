using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetEventAttendeesHandler : IRequestHandler<GetEventAttendeesQuery, List<AttendeeDto>>
{
    private readonly AppDbContext _db;
    public GetEventAttendeesHandler(AppDbContext db) => _db = db;

    public async Task<List<AttendeeDto>> Handle(GetEventAttendeesQuery q, CancellationToken ct)
    {
        var ev = await _db.Events.FirstOrDefaultAsync(e => e.Id == q.EventId, ct)
                 ?? throw new KeyNotFoundException("Event not found.");

        if (!(q.IsAdmin || ev.CreatedById == q.RequesterId))
            throw new UnauthorizedAccessException("Not allowed to view attendees for this event.");

        return await _db.Rsvps
            .Where(r => r.EventId == q.EventId)
            .Select(r => new AttendeeDto(
                r.User.Id,
                r.User.Name,
                r.User.Email,
                r.Status,
                r.RsvpDate))
            .ToListAsync(ct);
    }
}
