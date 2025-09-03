using MediatR;

public record RsvpToEventCommand(int EventId, int UserId, string Status = "Going") : IRequest<Unit>;
