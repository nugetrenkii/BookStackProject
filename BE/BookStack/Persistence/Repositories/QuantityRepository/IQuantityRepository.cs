using BookStack.Entities;

namespace BookStack.Persistence.Repositories.QuantityRepository
{
    public interface IQuantityRepository
    {
        void CreateQuantity(int Count);
        Quantity GetQuantity(int Count);
        bool IsSaveChanges();
    }
}
