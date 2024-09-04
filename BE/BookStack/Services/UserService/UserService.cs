using AutoMapper;
using BookStack.DTOs.Response;
using BookStack.DTOs.User;
using BookStack.Entities;
using BookStack.Persistence.Repositories.CartRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Utilities;

namespace BookStack.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;
        public UserService(IUserRepository userRepository, ICartRepository cartRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
        }

        public ResponseDTO CreateUser(CreateUserDTO createUserDTO)
        {
            var user = _userRepository.GetUserByUsername(createUserDTO.Username);
            if (user != null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User đã tồn tại"
                };
            }
            user = _mapper.Map<User>(createUserDTO);
            user.RoleId = 2;
            PasswordHelper.CreatePasswordHash(createUserDTO.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _userRepository.CreateUser(user);


            if (_userRepository.IsSaveChanges())
            {
                return new ResponseDTO()
                {
                    Message = "Tạo thành công"
                };
            }
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Tạo thất bại"
            };

        }

        public ResponseDTO DeleteUser(int id)
        {
            var user = _userRepository.GetUserById(id);
            if (user == null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User không tồn tại"
                };
            }
            user.IsDeleted = true;
            _userRepository.DeleteUser(user);
            if (_userRepository.IsSaveChanges()) return new ResponseDTO()
            {
                Message = "Xóa thành công"
            };
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Xóa thất bại"
            };
        }

        public ResponseDTO GetUserById(int id)
        {
            var user = _userRepository.GetUserById(id);
            if (user == null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User không tồn tại"
                };
            }
            return new ResponseDTO()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        public ResponseDTO GetUserByUsername(string username)
        {
            var user = _userRepository.GetUserByUsername(username);
            if (user == null)
            {
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User không tồn tại"
                };
            }
            return new ResponseDTO()
            {
                Data = _mapper.Map<UserDTO>(user)
            };
        }

        public ResponseDTO GetUsers(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var users = _userRepository.GetUsers(page, pageSize, key, sortBy);
            return new ResponseDTO()
            {
                Data = _mapper.Map<List<UserDTO>>(users),
                Total = _userRepository.GetUserCount()
            };
        }

        public ResponseDTO UpdateUser(int id, UpdateUserDTO updateUserDTO)
        {
            var user = _userRepository.GetUserById(id);
            if (user == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "User không tồn tại"
                };
            user.Update = DateTime.Now;
            user.FirstName = updateUserDTO.FirstName;
            user.LastName = updateUserDTO.LastName;
            user.Email = updateUserDTO.Email;
            user.Gender = updateUserDTO.Gender;
            user.Phone = updateUserDTO.Phone;
            user.Dob = updateUserDTO.Dob;
            if (updateUserDTO.Avatar != null)
                user.Avatar = updateUserDTO.Avatar;
            _userRepository.UpdateUser(user);

            if (_userRepository.IsSaveChanges()) return new ResponseDTO()
            {
                Message = "Cập nhật thành công"
            };
            else return new ResponseDTO()
            {
                Code = 400,
                Message = "Cập nhật thất bại"
            };
        }
    }
}
