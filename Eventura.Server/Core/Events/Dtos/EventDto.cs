namespace Eventura.Server.Core.Events.Dtos
{
    public record EventDto(
        int Id,
        string Title,
        string? Description,
        DateTime DateTime,
        string Location,
        string Category,
        int CreatedById,
        bool IsBlocked
    );
}
