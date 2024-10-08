﻿using BookStack.DTOs.Response;
using BookStack.DTOs.Tag;

namespace BookStack.Services.TagService
{
    public interface ITagService
    {
        ResponseDTO GetTags(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        ResponseDTO GetTagById(int id);
        ResponseDTO UpdateTag(int id, string name);
        ResponseDTO DeleteTag(int id);
        ResponseDTO CreateTag(CreateTagDTO createTagDto);
    }
}
