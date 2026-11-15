namespace SlotMachine.Server.Domain;

public class PayTable
{
    public static decimal CalculatePayout(Symbol[] reels, decimal bet)
    {
        return reels switch
        {
            [Symbol.Lemon, Symbol.Lemon, Symbol.Lemon] => bet * 3m,
            [Symbol.Cherry, Symbol.Cherry, Symbol.Cherry] => bet * 5m,
            [Symbol.Bell, Symbol.Bell, Symbol.Bell] => bet * 10m,
            [Symbol.Diamond, Symbol.Diamond, Symbol.Diamond] => bet * 25m,
            [Symbol.Seven, Symbol.Seven, Symbol.Seven] => bet * 50m,
            [Symbol.Lemon, Symbol.Lemon, _] or [_, Symbol.Lemon, Symbol.Lemon] => bet * 1.15m,
            [Symbol.Cherry, Symbol.Cherry, _] or [_, Symbol.Cherry, Symbol.Cherry] => bet * 1.15m,
            _ => 0m
        };
    }
}