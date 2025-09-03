using MediatR;
using Eventura.Server.Core.Events.Dtos;

namespace Eventura.Server.Core.Events.Commands
{
    public record CreateEventCommand(
        string Title,
        string? Description,
        DateTime EventDate,
        string Location,
        string Category,
        int CreatedById
    ) : IRequest<EventDto>;
}
