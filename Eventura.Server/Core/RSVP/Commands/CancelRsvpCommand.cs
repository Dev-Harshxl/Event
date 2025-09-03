using MediatR;

public record CancelRsvpCommand(int EventId, int UserId) : IRequest<Unit>;
