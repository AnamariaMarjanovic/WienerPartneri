using Dapper;
using Microsoft.Data.Sqlite;
using WienerPartneri.API.Models;
using WienerPartneri.API.Repositories.Interfaces;

namespace WienerPartneri.API.Repositories;

public class PolicyRepository : IPolicyRepository
{
    private readonly string _connectionString;

    public PolicyRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    private SqliteConnection CreateConnection() => new SqliteConnection(_connectionString);

    public async Task<IEnumerable<Policy>> GetPolicyByPartnerIdAsync(int partnerId)
    {
        using var connection = CreateConnection();
        var sql = "SELECT * FROM Policy WHERE PartnerId = @PartnerId";
        return await connection.QueryAsync<Policy>(sql, new { PartnerId = partnerId });
    }

    public async Task<int> CreatePolicyAsync(Policy policy) 
    {
        using var connection = CreateConnection();
        var sql = @"
            INSERT INTO Policy (PartnerId, PolicyNumber, Amount)
            VALUES (@PartnerId, @PolicyNumber, @Amount);
            SELECT last_insert_rowid();";
        return await connection.ExecuteScalarAsync<int>(sql, policy);
    }

    public async Task<int> GetPolicyCountByPartnerIdAsync(int partnerId)
    {
        using var connection = CreateConnection();
        var sql = "SELECT COUNT(*) FROM Policy WHERE PartnerId = @PartnerId";
        return await connection.ExecuteScalarAsync<int>(sql, new { PartnerId = partnerId });
    }

    public async Task<decimal> GetTotalAmountByPartnerIdAsync(int partnerId)
    {
        using var connection = CreateConnection();
        var sql = "SELECT SUM(Amount) FROM Policy WHERE PartnerId = @PartnerId";
        return await connection.ExecuteScalarAsync<int>(sql, new { PartnerId = partnerId });
    }
 }