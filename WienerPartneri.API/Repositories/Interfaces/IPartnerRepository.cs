using WienerPartneri.API.Models;

namespace WienerPartneri.API.Repositories.Interfaces;

public interface IPartnerRepository
{
    Task<PagedResult<Partner>> GetAllPartnersAsync(int page, int pageSize, string? search);
    Task<Partner?> GetPartnerByIdAsync(int id);
    Task<int> CreatePartnerAsync(Partner partner);
}