using SlotMachine.Server.DTOs;

namespace SlotMachine.Server.Services;

public interface IGameEngineService
{
    public decimal CreateSession(string connectionId);
    public void RemoveSession(string connectionId);
    public SpinResponse ExecuteSpin(string connectionId, SpinRequest spinRequest);
}
