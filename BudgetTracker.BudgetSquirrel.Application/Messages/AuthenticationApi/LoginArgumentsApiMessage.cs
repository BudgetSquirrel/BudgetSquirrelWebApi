using BudgetTracker.BudgetSquirrel.Application.Messages;
using BudgetTracker.Business.Auth;
using Newtonsoft.Json;

namespace BudgetTracker.BudgetSquirrel.Application.Messages.AuthenticationApi
{
    public class LoginArgumentsApiMessage : IApiMessage
    {
        /// <summary>
        /// Contains the username and password for logging in.
        /// All other properties on the <see cref="RegisterUserMessage" />
        /// will be ignored.
        /// </summary>
        [JsonProperty("credentials")]
        public RegisterUserMessage Credentials { get; set; }
    }
}
