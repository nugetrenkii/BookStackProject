namespace BookStack.DTOs.Rate;

public class SelfCreateRatingDTO
{
    public int Rate { get; set; }
    public string Comment { get; set; }
    public int BookId { get; set; }
}