using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ThirdParty.Json.LitJson;

namespace JWTAuth.WebApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("isVerified")]
        public bool IsVerified { get; set; } = false;

        [BsonElement("passwordHash")]
        public string? PasswordHash { get; set; }

        [BsonElement("info")]
        public Info? Info { get; set; }

        [BsonElement("verificationString")]
        public string? VerificationString { get; set; }
    }

    public class Info
    {
        [BsonElement("favoriteFood")]
        [JsonPropertyName("favoriteFood")]
        public string FavoriteFood { get; set; }

        [BsonElement("hairColor")]
        [JsonPropertyName("hairColor")]
        public string HairColor { get; set; }

        [BsonElement("bio")]
        [JsonPropertyName("bio")]
        public string Bio { get; set; }
    }
}
