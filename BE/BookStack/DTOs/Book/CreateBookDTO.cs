﻿using BookStack.DTOs.Author;
using BookStack.DTOs.Publisher;
using BookStack.DTOs.Tag;

namespace BookStack.DTOs.Book
{
    public class CreateBookDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int NumberOfPages { get; set; }
        public DateTime PublishDate { get; set; }
        public string Language { get; set; }
        public int Count { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public int PublisherId { get; set; }
        public int AuthorId { get; set; }
        public List<int> TagIds { get; set; }
    }
}
