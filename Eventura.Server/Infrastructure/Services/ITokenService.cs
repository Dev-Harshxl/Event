public interface ITokenService
{
    string CreateAccessToken(User user);
    string CreateRefreshToken();
}
