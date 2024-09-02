namespace BookStack.Persistence.Repositories.AddressRepository
{
    public interface IAddressRepository
    {
        List<Entities.Address> GetAddresses(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        List<Entities.Address> GetAddressByUser(int userId);
        Entities.Address GetAddressById(int? id = 0);
        void UpdateAddress(Entities.Address address);
        void DeleteAddress(Entities.Address address);
        void CreateAddress(Entities.Address address);
        int GetAddressCount();
        bool IsSaveChanges();
    }
}
