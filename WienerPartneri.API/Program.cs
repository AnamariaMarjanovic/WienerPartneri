using WienerPartneri.API.Data;
using WienerPartneri.API.Repositories;
using WienerPartneri.API.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Registracija repositorija
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddSingleton<IPartnerRepository>(_ => new PartnerRepository(connectionString));
builder.Services.AddSingleton<IPolicyRepository>(_ => new PolicyRepository(connectionString));

var app = builder.Build();

// Inicijalizacija baze
var dbInitializer = new DatabaseInitializer(connectionString);
dbInitializer.Initialize();

app.UseAuthorization();
app.MapControllers();

app.Run();