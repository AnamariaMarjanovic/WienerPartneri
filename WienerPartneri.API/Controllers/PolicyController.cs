using Microsoft.AspNetCore.Mvc;
using WienerPartneri.API.Models;
using WienerPartneri.API.Repositories.Interfaces;

namespace WienerPartneri.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PolicyController : ControllerBase
{
    private readonly IPolicyRepository _policyRepository;

    public PolicyController(IPolicyRepository policyRepository)
    {
        _policyRepository = policyRepository;
    }

    [HttpGet("partner/{partnerId}")]
    public async Task<IActionResult> GetByPartnerId(int partnerId)
    {
        var policies = await _policyRepository.GetPolicyByPartnerIdAsync(partnerId);
        return Ok(policies);
    }

    [HttpGet("stats/{partnerId}")]
    public async Task<IActionResult> GetStats(int partnerId)
    {
        var count = await _policyRepository.GetPolicyCountByPartnerIdAsync(partnerId);
        var totalAmount = await _policyRepository.GetTotalAmountByPartnerIdAsync(partnerId);
        return Ok(new { count, totalAmount });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Policy policy)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var id = await _policyRepository.CreatePolicyAsync(policy);
        return CreatedAtAction(nameof(GetByPartnerId), new { partnerId = policy.PartnerId }, new { id });
    }
}