using Dapper;
using Microsoft.Data.Sqlite;
using WienerPartneri.API.Models;
using WienerPartneri.API.Repositories.Interfaces;

namespace WienerPartneri.API.Repositories;

public class PartnerRepository: IPartnerRepository
{
    private readonly string _connectionString;

    public PartnerRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    private SqliteConnection CreateConnection() => new SqliteConnection(_connectionString);

    public async Task<PagedResult<Partner>> GetAllPartnersAsync(int page, int pageSize, string? search)
    {
         using var connection = CreateConnection();

        var whereClause = string.Empty;
        object parameters = new { };

        if (!string.IsNullOrWhiteSpace(search))
        {
            whereClause = "WHERE FirstName LIKE @Search OR LastName LIKE @Search OR PartnerNumber LIKE @Search";
            parameters = new { Search = $"%{search}%" };
        }

        var countSql = $"SELECT COUNT(*) FROM Partner {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT * FROM Partner 
            {whereClause}
            ORDER BY CreatedAtUtc DESC
            LIMIT @PageSize OFFSET @Offset";

        var items = await connection.QueryAsync<Partner>(dataSql, new
        {
            Search = $"%{search}%",
            PageSize = pageSize,
            Offset = (page - 1) * pageSize
        });

        return new PagedResult<Partner>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Partner?> GetPartnerByIdAsync(int id)
    {
        using var connection = CreateConnection();
        var sql = "SELECT * FROM Partner WHERE Id = @Id";
        return await connection.QuerySingleOrDefaultAsync<Partner>(sql, new { Id = id });
    }

    public async Task<int> CreatePartnerAsync(Partner partner)
    {
        using var connection = CreateConnection();
        var sql = @"
            INSERT INTO Partner
                (FirstName, LastName, Address, PartnerNumber, CroatianPIN, PartnerTypeId, CreatedAtUtc, CreatedByUser, IsForeign, ExternalCode, Gender)
            VALUES 
                (@FirstName, @LastName, @Address, @PartnerNumber, @CroatianPIN, @PartnerTypeId, @CreatedAtUtc, @CreatedByUser, @IsForeign, @ExternalCode, @Gender);
            SELECT last_insert_rowid();";
        

        return await connection.ExecuteScalarAsync<int>(sql, partner);
    }
 }
