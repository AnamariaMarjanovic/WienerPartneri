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

    public async Task<IEnumerable<Partner>> GetAllPartnersAsync()
    {
        using var connection = CreateConnection();
        var sql = "SELECT * FROM Partner ORDER BY CreatedAtUtc DESC";
        return await connection.QueryAsync<Partner>(sql);
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
