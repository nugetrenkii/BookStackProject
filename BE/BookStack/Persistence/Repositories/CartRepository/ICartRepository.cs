﻿using BookStack.Entities;

namespace BookStack.Persistence.Repositories.CartRepository
{
    public interface ICartRepository
    {
        List<Cart> GetCarts();
        void UpdateCart(Cart cart);
        void CreateCart(Cart cart);
        Cart GetCartById(int id);
        void ClearCartBook(List<int> ids);
        Cart GetCartByUser(int userId);
        bool IsSaveChanges();
    }
}
