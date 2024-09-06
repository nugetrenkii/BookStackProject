﻿using BookStack.DTOs.Rate;
using BookStack.DTOs.Response;

namespace BookStack.Services.RatingService
{
    public interface IRatingService
    {
        ResponseDTO GetRatings(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        ResponseDTO GetRatingById(int id);
        ResponseDTO GetRatingByBook(int bookId, int? page = 1);
        //ResponseDTO UpdateRating(int id, string name);
        ResponseDTO DeleteRating(int id);
        ResponseDTO CreateRating(CreateRatingDTO createRatingDTO);
        ResponseDTO SelfRating(SelfCreateRatingDTO selfCreateRatingDTO);
    }
}
