using JWTAuth.WebApi.Services;
using Microsoft.AspNetCore.Mvc;
using JWTAuth.WebApi.Models;
using JWTAuth.WebApi.Helpers;

namespace JWTAuth.WebApi.Controllers
{
    [Route("api/signup")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly UsersService _usersService;

        public SignupController(IConfiguration configuration, UsersService usersService)
        {
            _configuration = configuration;
            _usersService = usersService;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserInfo _userData)
        {
            if (_userData is { Email: not null, Password: not null })
            {
                var user = await GetUserAsync(_userData.Email);

                if (user != null)
                {
                    return Conflict();
                }

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(_userData.Password, workFactor: 10);

                var verificationString = Guid.NewGuid().ToString();

                var newUser = new User
                {
                    Email = _userData.Email,
                    PasswordHash = passwordHash,
                    VerificationString = verificationString,
                    Info = new Info
                    {
                        HairColor = string.Empty,
                        FavoriteFood = string.Empty,
                        Bio = string.Empty
                    }
                };

                await _usersService.CreateAsync(newUser);

                var insertedUser = await GetUserAsync(newUser.Email);

                if (insertedUser != null)
                {
                    var tokenResponse = TokenHelper.GenerateTokenResponse(insertedUser, _configuration);

                    return Ok(tokenResponse);
                }
            }

            return BadRequest();
        }

        private async Task<User> GetUserAsync(string email)
        {
            var users = await _usersService.GetAsync();

            var user = users.FirstOrDefault(u => u.Email == email)!;

            return user;
        }
    }
}
