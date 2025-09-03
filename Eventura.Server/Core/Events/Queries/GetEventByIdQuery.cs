using MediatR;
using Eventura.Server.Core.Events.Dtos;

namespace Eventura.Server.Core.Events.Queries
{
    public record GetEventByIdQuery(int Id) : IRequest<EventDto?>;
}
