using Microsoft.AspNetCore.SignalR;
using SlotMachine.Server.DTOs;
using SlotMachine.Server.Services;

namespace SlotMachine.Server.Hubs;

public class SlotHub : Hub
{
    private readonly IGameEngineService _gameEngineService;

    public SlotHub(IGameEngineService gameEngineService)
    {
        _gameEngineService = gameEngineService;
    }
    public override async Task OnConnectedAsync()
    {
        var initialBalance = _gameEngineService.CreateSession(Context.ConnectionId);

        await Clients.Caller.SendAsync("ReceiveInitialBalance", initialBalance);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _gameEngineService.RemoveSession(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public SpinResponse Spin(SpinRequest request)
    {
        return _gameEngineService.ExecuteSpin(Context.ConnectionId, request);
    }

}
