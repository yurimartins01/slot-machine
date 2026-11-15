namespace SlotMachine.Server.DTOs;

public record SpinResponse
{
    public required string[] Reels { get; init; }
    public decimal Payout { get; init; }
    public decimal NewBalance { get; init; }
    public bool IsWin { get; init; }

}
