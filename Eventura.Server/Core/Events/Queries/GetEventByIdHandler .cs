using MediatR;
using Microsoft.EntityFrameworkCore;
using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Infrastructure.Data;

namespace Eventura.Server.Core.Events.Queries
{
    public class GetEventByIdHandler : IRequestHandler<GetEventByIdQuery, EventDto?>
    {
        private readonly AppDbContext _db;

        public GetEventByIdHandler(AppDbContext db) => _db = db;

        public async Task<EventDto?> Handle(GetEventByIdQuery q, CancellationToken ct)
        {
            var ev = await _db.Events.FirstOrDefaultAsync(e => e.Id == q.Id, ct);
            return ev?.ToDto();
        }
    }
}
