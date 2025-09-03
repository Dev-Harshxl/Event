using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eventura.Server.Core.Events.Commands
{
    public class CreateEventHandler : IRequestHandler<CreateEventCommand, EventDto>
    {
        private readonly AppDbContext _db;

        public CreateEventHandler(AppDbContext db) => _db = db;

        public async Task<EventDto> Handle(CreateEventCommand r, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(r.Title))
                throw new ArgumentException("Title is required.");
            if (string.IsNullOrWhiteSpace(r.Location))
                throw new ArgumentException("Location is required.");
            if (r.EventDate <= DateTime.UtcNow)
                throw new ArgumentException("Event date/time must be in the future.");

            var creatorExists = await _db.Users.AnyAsync(u => u.Id == r.CreatedById, ct);
            if (!creatorExists)
                throw new ArgumentException("Creator not found.");

            var ev = new Event
            {
                Title = r.Title.Trim(),
                Description = r.Description,
                EventDate = r.EventDate,
                Location = r.Location.Trim(),
                Category = r.Category?.Trim() ?? "General",
                CreatedById = r.CreatedById,
                ImageData = r.ImageData,
                ImageContentType = r.ImageContentType,
                ImageFileName = r.ImageFileName,
            };

            _db.Events.Add(ev);
            await _db.SaveChangesAsync(ct);

            return ev.ToDto();
        }
    }
}
