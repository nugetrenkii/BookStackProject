﻿using System.ComponentModel.DataAnnotations;

namespace BookStack.Entities
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public DateTime Create { get; set; } = DateTime.Now;
        public DateTime Update { get; set; } = DateTime.Now;
    }
}
