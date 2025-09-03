namespace Eventura.Server.Core.Events.Dtos
{
    public record EventFeedbackDto(
        int Id,
        int EventId,
        int UserId,
        int Rating,
        string Comment,
        DateTime CreatedAt
    );
}
