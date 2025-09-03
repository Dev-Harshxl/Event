using Eventura.Server.Core.Events.Dtos;
using MediatR;

public record GetEventAttendeesQuery(
    int EventId,
    int RequesterId,
    bool IsAdmin
) : IRequest<List<AttendeeDto>>;
