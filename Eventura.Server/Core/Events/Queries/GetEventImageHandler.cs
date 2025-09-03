using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Core.Events.Queries
{
    public class GetEventImageHandler : IRequestHandler<GetEventImageQuery, EventImageResult?>
    {
        private readonly AppDbContext _db;

        public GetEventImageHandler(AppDbContext db) => _db = db;

        public async Task<EventImageResult?> Handle(GetEventImageQuery q, CancellationToken ct)
        {
            var ev = await _db.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Id == q.Id, ct);

            if (ev is null || ev.ImageData is null || ev.ImageData.Length == 0)
                return null;

            return new EventImageResult(
                ev.ImageData,
                ev.ImageContentType ?? "application/octet-stream",
                ev.ImageFileName
            );
        }
    }
}
