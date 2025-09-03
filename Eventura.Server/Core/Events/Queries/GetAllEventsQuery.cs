using Eventura.Server.Core.Events.Dtos;
using MediatR;

public record GetAllEventsQuery(
    string? Category,
    DateTime? From,
    DateTime? To,
    string? Location,
    int? UserId,         // creator filter
    bool IncludeBlocked, // only respected if IsAdmin
    bool IsAdmin         // passed from controller
) : IRequest<List<EventDto>>;
