using SlotMachine.Server.Domain;
using SlotMachine.Server.Hubs;
using SlotMachine.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ReelStrip>();
builder.Services.AddSingleton<IRngService, RngService>();
builder.Services.AddSingleton<IGameEngineService, GameEngineService>();

builder.Services.AddSignalR();


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "ClientPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173");
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowCredentials();
        });

});

var app = builder.Build();

app.UseCors("ClientPolicy");

app.MapHub<SlotHub>("/slothub");

app.Run();
