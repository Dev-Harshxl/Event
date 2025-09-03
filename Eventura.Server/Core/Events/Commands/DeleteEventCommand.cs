using MediatR;

public record DeleteEventCommand(int EventId, int RequesterId, bool IsAdmin) : IRequest<Unit>;
