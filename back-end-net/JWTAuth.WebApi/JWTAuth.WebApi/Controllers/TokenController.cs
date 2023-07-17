using JWTAuth.WebApi.Services;
using Microsoft.AspNetCore.Mvc;
using JWTAuth.WebApi.Models;
using JWTAuth.WebApi.Helpers;

namespace JWTAuth.WebApi.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly UsersService _usersService;

        public TokenController(IConfiguration configuration, UsersService usersService)
        {
            _configuration = configuration;
            _usersService = usersService;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserInfo _userData)
        {
            if (_userData is { Email: not null, Password: not null })
            {
                var user = await GetUser(_userData.Email, _userData.Password);

                if (user != null)
                {
                    var tokenResponse = TokenHelper.GenerateTokenResponse(user, _configuration);

                    return Ok(tokenResponse);
                }

                return BadRequest("Invalid credentials");
            }

            return BadRequest();
        }

        private async Task<User?> GetUser(string email, string password)
        {
            var users = await _usersService.GetAsync();

            if (users.Any())
            {
                var user = users.FirstOrDefault(u => u.Email == email)!;

                if (user is not null)
                {
                    var isCorrect = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

                    return isCorrect ? user : null;
                }

                return null;
            }
            return null;
        }
    }
}
