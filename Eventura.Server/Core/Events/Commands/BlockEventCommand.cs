using MediatR;

public record BlockEventCommand(int EventId, bool Block, bool IsAdmin) : IRequest<Unit>;
