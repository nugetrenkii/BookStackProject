using AutoMapper;
using BookStack.DTOs.Response;
using BookStack.DTOs.Tag;
using BookStack.Entities;
using BookStack.Persistence.Repositories.TagRepository;

namespace BookStack.Services.TagService
{
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;
        public TagService(ITagRepository tagRepository, IMapper mapper)
        {
            _tagRepository = tagRepository;
            _mapper = mapper;
        }

        public ResponseDTO CreateTag(CreateTagDTO createTagDto)
        {
            var tag = new Tag { Name = createTagDto.Name, Image = createTagDto.Image };
            _tagRepository.CreateTag(tag);
            if (_tagRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Tạo thành công" };
            else return new ResponseDTO() { Code = 400, Message = "Tạo thất bại" };
        }

        public ResponseDTO DeleteTag(int id)
        {
            var tag = _tagRepository.GetTagById(id);
            if (tag == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Tag không tồn tại"
                };
            tag.IsDeleted = true;
            _tagRepository.UpdateTag(tag);
            if (_tagRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Cập nhật thành công" };
            else return new ResponseDTO() { Code = 400, Message = "Cập nhật thất bại" };
        }

        public ResponseDTO GetTagById(int id)
        {
            var tag = _tagRepository.GetTagById(id);
            if (tag == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Tag không tồn tại"
                };
            return new ResponseDTO()
            {
                Data = _mapper.Map<TagDTO>(tag)
            };
        }

        public ResponseDTO GetTags(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID")
        {
            var tags = _tagRepository.GetTags(page, pageSize, key, sortBy);
            return new ResponseDTO()
            {
                Data = _mapper.Map<List<TagDTO>>(tags),
                Total = _tagRepository.GetTagCount()
            };
        }

        public ResponseDTO UpdateTag(int id, string name)
        {
            var tag = _tagRepository.GetTagById(id);
            if (tag == null)
                return new ResponseDTO()
                {
                    Code = 400,
                    Message = "Tag không tồn tại"
                };
            tag.Update = DateTime.Now;
            tag.Name = name;
            _tagRepository.UpdateTag(tag);
            if (_tagRepository.IsSaveChanges()) return new ResponseDTO() { Message = "Cập nhật thành công" };
            else return new ResponseDTO() { Code = 400, Message = "Cập nhật thất bại" };
        }
    }
}
