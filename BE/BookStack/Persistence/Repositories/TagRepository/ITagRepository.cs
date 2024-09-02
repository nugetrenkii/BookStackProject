using BookStack.Entities;

namespace BookStack.Persistence.Repositories.TagRepository
{
    public interface ITagRepository
    {
        List<Tag> GetTags(int? page = 1, int? pageSize = 10, string? key = "", string? sortBy = "ID");
        Tag GetTagById(int id);
        void UpdateTag(Tag tag);
        void DeleteTag(Tag tag);
        void CreateTag(Tag tag);
        int GetTagCount();
        bool IsSaveChanges();
    }
}
