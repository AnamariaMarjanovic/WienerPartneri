using WienerPartneri.API.Models;

namespace WienerPartneri.API.Repositories.Interfaces;

public interface IPolicyRepository
{
    Task<IEnumerable<Policy>> GetPolicyByPartnerIdAsync(int partnerId);
    Task<int> CreatePolicyAsync(Policy policy);
    Task<int> GetPolicyCountByPartnerIdAsync(int partnerId);
    Task<decimal> GetTotalAmountByPartnerIdAsync(int partnerId);
}