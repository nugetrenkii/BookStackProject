using BookStack.DTOs.Response;
using BookStack.DTOs.User;

namespace BookStack.Services.UserService
{
    public interface IUserService
    {
        ResponseDTO GetUsers(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        ResponseDTO GetUserById(int id);
        ResponseDTO GetUserByUsername(string username);
        ResponseDTO UpdateUser(int id, UpdateUserDTO updateUserDTO);
        ResponseDTO DeleteUser(int id);
        ResponseDTO CreateUser(CreateUserDTO createUserDTO);
    }
}
