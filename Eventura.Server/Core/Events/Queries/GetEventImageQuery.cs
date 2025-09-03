using Eventura.Server.Core.Events.Dtos;
using MediatR;

namespace Eventura.Server.Core.Events.Queries
{
    public record GetEventImageQuery(int Id) : IRequest<EventImageResult?>;
}
