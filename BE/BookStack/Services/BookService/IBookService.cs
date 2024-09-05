using BookStack.DTOs.Book;
using BookStack.DTOs.Response;

namespace BookStack.Services.BookService
{
    public interface IBookService
    {
        ResponseDTO GetBooks(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID", int? tagId = 0);
        ResponseDTO GetBookRecommendations();
        ResponseDTO GetTopRatedBooks(int topCount = 10);
        ResponseDTO GetTopOrderedBooks(int topCount = 10);
        ResponseDTO GetBookById(int id);
        ResponseDTO GetBookByIds(List<int> ids);
        ResponseDTO UpdateBook(int id, UpdateBookDTO updateBookDTO);
        ResponseDTO DeleteBook(int id);
        ResponseDTO GetCart(List<int> bookIds);
        ResponseDTO CreateBook(CreateBookDTO createBookDTO);
    }
}
