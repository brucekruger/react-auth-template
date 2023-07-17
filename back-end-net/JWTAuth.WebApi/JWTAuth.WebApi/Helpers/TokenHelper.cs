using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using JWTAuth.WebApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace JWTAuth.WebApi.Helpers;

public static class TokenHelper
{
    public static object GenerateTokenResponse(User user, IConfiguration configuration)
    {
        //create claims details based on the user information
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, configuration["Jwt:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim("id", user.Id),
            new Claim("isVerified", user.IsVerified.ToString()),
            new Claim("email", user.Email),
            new Claim("info", JsonSerializer.Serialize(user.Info))
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: signIn);

        var tokenResponse = new { token = new JwtSecurityTokenHandler().WriteToken(token) };
        return tokenResponse;
    }
}