using System.Threading.Tasks;
using BudgetSquirrel.Api.RequestModels;
using BudgetSquirrel.Business.Auth;
using BudgetSquirrel.Data.EntityFramework.Models;

namespace BudgetSquirrel.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User> Authenticate(LoginRequest credentials);
    }
}