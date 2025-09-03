using Eventura.Server.Core.Events.Dtos;
using MediatR;

public record GiveFeedbackCommand(
    int EventId,
    int UserId,
    int Rating,
    string Comment,
    IFormFile? Image1,
    IFormFile? Image2,
    IFormFile? Image3
) : IRequest<EventFeedbackDto>;
