namespace Eventura.Server.Core.Events.Dtos
{
    public record EventImageResult(byte[] Data, string ContentType, string? FileName);
}
