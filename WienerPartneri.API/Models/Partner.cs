namespace WienerPartneri.API.Models;

public class Partner 
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string PartnerNumber { get; set; } = string.Empty;
    public string? CroatianPIN { get; set; }
    public int PartnerTypeId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string CreatedByUser { get; set; } = string.Empty;
    public bool IsForeign { get; set; }
    public string? ExternalCode { get; set; }
    public string Gender { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}";
}