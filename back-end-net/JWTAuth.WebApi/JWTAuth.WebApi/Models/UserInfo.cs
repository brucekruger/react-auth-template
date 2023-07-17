using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace JWTAuth.WebApi.Models
{
    public class UserInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? Password { get; set; }
        public UserInfoObject? Info { get; set; }
        public string? VerificationString { get; set; }
    }

    public class UserInfoObject
    {
        public string FavoriteFood { get; set; }

        public string HairColor { get; set; }

        public string Bio { get; set; }
    }
}
