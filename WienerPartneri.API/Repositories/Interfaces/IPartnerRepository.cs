using WienerPartneri.API.Models;

namespace WienerPartneri.API.Repositories.Interfaces;

public interface IPartnerRepository
{
    Task<IEnumerable<Partner>> GetAllPartnersAsync();
    Task<Partner?> GetPartnerByIdAsync(int id);
    Task<Partner> CreatePartnerAsync(Partner partner);
}