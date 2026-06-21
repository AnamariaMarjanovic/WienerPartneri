namespace WienerPartneri.API.Models;

public class Policy
{
    public int Id { get; set; }
    public int PartnerId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}