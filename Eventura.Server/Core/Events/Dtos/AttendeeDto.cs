namespace Eventura.Server.Core.Events.Dtos
{
    public record AttendeeDto(
        int Id,
        string Name,
        string Email,
        string Status,
        DateTime RsvpDate
    );
}
