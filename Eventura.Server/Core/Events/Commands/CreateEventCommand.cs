using Eventura.Server.Core.Events.Dtos;
using MediatR;

namespace Eventura.Server.Core.Events.Commands
{
    public record CreateEventCommand(
        string Title,
        string? Description,
        DateTime EventDate,
        string Location,
        string Category,
        int CreatedById,
        byte[]? ImageData,
        string? ImageContentType,
        string? ImageFileName
    ) : IRequest<EventDto>;
}
