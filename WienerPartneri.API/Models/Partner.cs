namespace WienerPartneri.API.Models;

public enum PartnerType
{
    Personal = 1,
    Legal = 2
}

public enum Gender
{
    M,
    F,
    N
}

public class Partner 
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string PartnerNumber { get; set; } = string.Empty;
    public string? CroatianPIN { get; set; }
    public PartnerType PartnerTypeId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string CreatedByUser { get; set; } = string.Empty;
    public bool IsForeign { get; set; }
    public string? ExternalCode { get; set; }
    public Gender Gender { get; set; }

    public string FullName => $"{FirstName} {LastName}";
}