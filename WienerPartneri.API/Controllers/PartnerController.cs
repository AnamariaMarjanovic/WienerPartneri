using Microsoft.AspNetCore.Mvc;
using WienerPartneri.API.Models;
using WienerPartneri.API.Repositories.Interfaces;

namespace WienerPartneri.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartnerController : ControllerBase
{
    private readonly IPartnerRepository _partnerRepository;
    private readonly IPolicyRepository _policyRepository;

    public PartnerController(IPartnerRepository partnerRepository, IPolicyRepository policyRepository)
    {
        _partnerRepository = partnerRepository;
        _policyRepository = policyRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPartners(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null)
    {
        var result = await _partnerRepository.GetAllPartnersAsync(page, pageSize, search);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPartnerById(int id)
    {
        var partner = await _partnerRepository.GetPartnerByIdAsync(id);
        if (partner == null)
        {
            return NotFound();
        }
        return Ok(partner);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePartner([FromBody] Partner partner)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        partner.CreatedAtUtc = DateTime.UtcNow;
        var newPartnerId = await _partnerRepository.CreatePartnerAsync(partner);
        return CreatedAtAction(nameof(GetPartnerById), new { id = newPartnerId }, new { id = newPartnerId });
    }
}