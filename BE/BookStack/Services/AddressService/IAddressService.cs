using BookStack.DTOs.Address;
using BookStack.DTOs.Response;

namespace BookStack.Services.AddressService
{
    public interface IAddressService
    {
        ResponseDTO GetAddresses(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        ResponseDTO GetAddressByUser(int userId);
        ResponseDTO GetAddressById(int id);
        ResponseDTO UpdateAddress(int id, UpdateAddressDTO updateAddressDTO);
        ResponseDTO DeleteAddress(int id);
        ResponseDTO CreateAddress(CreateAddressDTO createAddressDTO);
    }
}
