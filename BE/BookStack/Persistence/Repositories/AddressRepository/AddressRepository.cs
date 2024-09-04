﻿using Microsoft.EntityFrameworkCore;

namespace BookStack.Persistence.Repositories.AddressRepository
{
    public class AddressRepository : IAddressRepository
    {
        private readonly DataContext _dataContext;
        public AddressRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public void CreateAddress(Entities.Address address)
        {
            _dataContext.Addresses.Add(address);
        }

        public void DeleteAddress(Entities.Address address)
        {
            _dataContext.Addresses.Remove(address);
        }

        public Entities.Address GetAddressById(int? id = 0)
        {
            if (id != 0)
                return _dataContext.Addresses.Include(a => a.User).FirstOrDefault(a => a.Id == id && a.IsDeleted == false);
            else return _dataContext.Addresses.Include(a => a.User).Where(a => a.User.Id == 2 && a.IsDeleted == false).OrderBy(a => a.Id).LastOrDefault();
        }

        public List<Entities.Address> GetAddressByUser(int userId)
        {
            return _dataContext.Addresses.Include(a => a.User).Where(a => a.User.Id == userId && a.IsDeleted == false).ToList();
        }

        public int GetAddressCount()
        {
            return _dataContext.Addresses.Count();
        }

        public List<Entities.Address> GetAddresses(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var query = _dataContext.Addresses.Include(a => a.User).AsQueryable();

            if (!string.IsNullOrEmpty(key))
            {
                query = query.Where(a => (a.Street + ", " + a.City + ", " + a.Phone + ", " + a.State + ", " + a.Phone).ToLower().Contains(key.ToLower()));
            }

            switch (sortBy)
            {
                case "Street":
                    query = query.OrderBy(u => u.Street);
                    break;
                default:
                    query = query.OrderBy(u => u.IsDeleted).ThenBy(u => u.Id);
                    break;
            }
            if (page == null || pageSize == null || sortBy == null) { return query.ToList(); }
            else
                return query.Where(a => a.IsDeleted == false).Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
        }

        public bool IsSaveChanges()
        {
            return _dataContext.SaveChanges() > 0;
        }

        public void UpdateAddress(Entities.Address address)
        {
            _dataContext.Entry(address).State = EntityState.Modified;
        }
    }
}
