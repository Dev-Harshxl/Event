using Eventura.Server.Core.Events.Dtos;
using Eventura.Server.Domain.Entities;
using Eventura.Server.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GiveFeedbackHandler : IRequestHandler<GiveFeedbackCommand, EventFeedbackDto>
{
    private readonly AppDbContext _db;

    public GiveFeedbackHandler(AppDbContext db) => _db = db;

    public async Task<EventFeedbackDto> Handle(GiveFeedbackCommand r, CancellationToken ct)
    {
        // Ensure user attended event
        var isAttendee = await _db.Rsvps.AnyAsync(
            x => x.EventId == r.EventId && x.UserId == r.UserId,
            ct
        );

        if (!isAttendee)
            throw new UnauthorizedAccessException("Only attendees can give feedback.");

        // Convert images to byte arrays
        (byte[]? data, string? type) ReadFile(IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return (null, null);

            using var ms = new MemoryStream();
            file.CopyTo(ms);
            return (ms.ToArray(), file.ContentType);
        }

        var (img1, type1) = ReadFile(r.Image1);
        var (img2, type2) = ReadFile(r.Image2);
        var (img3, type3) = ReadFile(r.Image3);

        var feedback = new EventFeedback
        {
            EventId = r.EventId,
            UserId = r.UserId,
            Rating = r.Rating,
            Comment = r.Comment,
            Image1 = img1,
            Image1ContentType = type1,
            Image2 = img2,
            Image2ContentType = type2,
            Image3 = img3,
            Image3ContentType = type3,
        };

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync(ct);

        return new EventFeedbackDto(
            feedback.Id,
            feedback.EventId,
            feedback.UserId,
            feedback.Rating,
            feedback.Comment,
            feedback.CreatedAt
        );
    }
}
