using AutoMapper;
using BookStack.DTOs.Rate;
using BookStack.DTOs.Response;
using BookStack.Entities;
using BookStack.Persistence.Repositories.BookRepository;
using BookStack.Persistence.Repositories.RatingRepository;
using BookStack.Persistence.Repositories.UserRepository;
using BookStack.Utilities;

namespace BookStack.Services.RatingService
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IUserRepository _userRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IMapper _mapper;
        private readonly UserAccessor _userAccessor;
        
        public RatingService(IRatingRepository ratingRepository, IMapper mapper, IBookRepository bookRepository, IUserRepository userRepository, UserAccessor userAccessor)
        {
            _ratingRepository = ratingRepository;
            _userRepository = userRepository;
            _userAccessor = userAccessor;
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        public ResponseDTO CreateRating(CreateRatingDTO createRatingDTO)
        {
            if (createRatingDTO.Rate <= 0 || createRatingDTO.Rate > 5) return new ResponseDTO() { Code = 400, Message = "Giá trị rate không hợp lệ" };
            var user = _userRepository.GetUserById(createRatingDTO.UserId);
            if (user == null) return new ResponseDTO() { Code = 400, Message = "User không tồn tại" };

            var book = _bookRepository.GetBookById(createRatingDTO.BookId);
            if (book == null) return new ResponseDTO() { Code = 400, Message = "Book không tồn tại" };

            var rating = _mapper.Map<Rating>(createRatingDTO);

            _ratingRepository.CreateRating(rating);
            if (_ratingRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Tạo thành công" };
            else return new ResponseDTO() { Code = 400, Message = "Tạo thất bại" };
        }

        public ResponseDTO SelfRating(SelfCreateRatingDTO selfCreateRatingDTO)
        {
            var userId = _userAccessor.GetCurrentUserId();
            if (userId != null)
            {
                var rating = new CreateRatingDTO
                {
                    Rate = selfCreateRatingDTO.Rate,
                    Comment = selfCreateRatingDTO.Comment,
                    UserId = (int)userId,
                    BookId = selfCreateRatingDTO.BookId
                };

                return CreateRating(rating);
            }
            
            return new ResponseDTO() { Code = 400, Message = "Không tìm thấy User" };
        }

        public ResponseDTO DeleteRating(int id)
        {
            var rating = _ratingRepository.GetRatingById(id);

            if (rating == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Rating không tồn tại"
                };

            rating.IsDeleted = true;
            _ratingRepository.UpdateRating(rating);

            if (_ratingRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Cập nhật thành công" };
            else return new ResponseDTO() { Code = 400, Message = "Cập nhật thất bại" };
        }

        public ResponseDTO GetRatingById(int id)
        {
            var rating = _ratingRepository.GetRatingById(id);
            if (rating == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Rating không tồn tại"
                };
            return new ResponseDTO()
            {
                Data = _mapper.Map<RatingDTO>(rating)
            };
        }

        public ResponseDTO GetRatingByBook(int bookId, int? page = 1)
        {
            var ratings = _ratingRepository.GetRatingByBook(bookId,page);
            double average = 0;
            foreach (var rating in ratings) average += rating.Rate;
            average /= ratings.Count;
            return new ResponseDTO()
            {
                Data = new { 
                    Ratings = ratings.Count > 0 ? _mapper.Map<List<RatingDTO>>(ratings) : new List<RatingDTO>(),
                    Average = ratings.Count > 0 ? average : 0
                },
                Total = _ratingRepository.GetRatingCount()
            };
        }

        public ResponseDTO GetRatings(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var ratings = _ratingRepository.GetRatings(page, pageSize, key, sortBy);
            return new ResponseDTO()
            {
                Data = _mapper.Map<List<RatingDTO>>(ratings),
                Total = _ratingRepository.GetRatingCount()
            };
        }

        //public ResponseDTO UpdateRating(int id, string name)
        //{
        //    var rating = _ratingRepository.GetRatingById(id);
        //    if (rating == null)
        //        return new ResponseDTO()
        //        {
        //            Code = 400,
        //            Message = "Rating không tồn tại"
        //        };
        //    rating.Update = DateTime.Now;
        //    rating.Rate = 0;
        //    _ratingRepository.UpdateRating(rating);
        //    if (_ratingRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Cập nhật thành công" };
        //    else return new ResponseDTO() { Code = 400, Message = "Cập nhật thất bại" };
        //}
    }
}
