using Microsoft.AspNetCore.SignalR;
using SlotMachine.Server.Domain;
using SlotMachine.Server.DTOs;
using System.Collections.Concurrent;

namespace SlotMachine.Server.Services;

public class GameEngineService : IGameEngineService
{
    private readonly IRngService _rngService;
    private readonly ReelStrip _reelStrip;
    private readonly ConcurrentDictionary<string, PlayerSession> _session = new();
    public GameEngineService(IRngService rngService, ReelStrip reelStrip)
    {
        _rngService = rngService;
        _reelStrip = reelStrip;
    }
    public decimal CreateSession(string connectionId)
    {
        var session = new PlayerSession(connectionId);
        _session.TryAdd(connectionId, session);

        return session.CurrentBalance;
    }

    public void RemoveSession(string connectionId)
    {
        if (connectionId is not null)
        {
            _session.TryRemove(connectionId, out PlayerSession? _);

        }
    }

    public SpinResponse ExecuteSpin(string connectionId, SpinRequest spinRequest)
    {

        if (!_session.TryGetValue(connectionId, out PlayerSession? session))
        {
            throw new HubException($"Sessão {connectionId} não encontrada.");
        }

        lock (session.LockObject)
        {

            if (!session.TryDebit(spinRequest.BetAmount))
            {
                throw new HubException($"Saldo insuficiente ou valor de aposta inválido.");
            }

            Symbol[] drawnSymbols = new Symbol[3];

            for (int i = 0; i < drawnSymbols.Length; i++)
            {
                var randomSymbol = _reelStrip.Symbols[_rngService.GetRandomIndex(_reelStrip.Symbols.Count)];
                drawnSymbols[i] = randomSymbol;
            }

            var reel = drawnSymbols.Select(s => s.ToString()).ToArray();
            var payout = PayTable.CalculatePayout(drawnSymbols, spinRequest.BetAmount);

            session.Credit(payout);

            return new SpinResponse
            {
                Reels = reel,
                Payout = payout,
                NewBalance = session.CurrentBalance,
                IsWin = payout > 0
            };
        }
    }

}
