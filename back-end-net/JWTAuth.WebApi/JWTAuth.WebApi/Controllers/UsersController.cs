using JWTAuth.WebApi.Helpers;
using JWTAuth.WebApi.Models;
using JWTAuth.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JWTAuth.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController: ControllerBase
    {
        public IConfiguration _configuration;
        private readonly UsersService _usersService;

        public UsersController(IConfiguration configuration, UsersService usersService)
        {
            _configuration = configuration;
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<List<User>> Get() =>
            await _usersService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _usersService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        //[HttpPut("{id:length(24)}")]
        //public async Task<IActionResult> Update(string id, User updatedUser)
        //{
        //    var user = await _usersService.GetAsync(id);

        //    if (user is null)
        //    {
        //        return NotFound();
        //    }

        //    updatedUser.Id = user.Id;

        //    await _usersService.UpdateAsync(id, updatedUser);

        //    return NoContent();
        //}

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> UpdateUserInfo(string id, [FromBody] Info userInfo)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            user.Info = userInfo;

            await _usersService.UpdateAsync(id, user);

            var tokenResponse = TokenHelper.GenerateTokenResponse(user, _configuration);

            return Ok(tokenResponse);
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _usersService.RemoveAsync(id);

            return NoContent();
        }
    }
}
