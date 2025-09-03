using Eventura.Server.Core.Events.Dtos;

public static class EventMappingExtensions
{
    public static EventDto ToDto(this Event e) =>
        new(e.Id, e.Title, e.Description, e.EventDate, e.Location, e.Category, e.CreatedById, e.IsBlocked);
}
