using Microsoft.Data.Sqlite;

namespace WienerPartneri.API.Data;

public class DatabaseInitializer
{
    private readonly string _connectionString;

    public DatabaseInitializer(string connectionString)
    {
        _connectionString = connectionString;
    }

    public void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        var sql = @"
            CREATE TABLE IF NOT EXISTS Partner (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                FirstName TEXT NOT NULL,
                LastName TEXT NOT NULL,
                Address TEXT,
                PartnerNumber TEXT NOT NULL,
                CroatianPIN TEXT,
                PartnerTypeId INTEGER NOT NULL,
                CreatedAtUtc TEXT NOT NULL DEFAULT (datetime('now')),
                CreatedByUser TEXT NOT NULL,
                IsForeign INTEGER NOT NULL,
                ExternalCode TEXT UNIQUE,
                Gender TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Policy (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                PartnerId INTEGER NOT NULL,
                PolicyNumber TEXT NOT NULL,
                Amount REAL NOT NULL,
                FOREIGN KEY (PartnerId) REFERENCES Partner(Id)
            );";

        using var command = new SqliteCommand(sql, connection);
        command.ExecuteNonQuery();
    }
}