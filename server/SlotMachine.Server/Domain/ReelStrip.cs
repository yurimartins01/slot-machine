namespace SlotMachine.Server.Domain;

public class ReelStrip
{
    public IReadOnlyList<Symbol> Symbols { get; }

    public ReelStrip()
    {
        var weights = new Dictionary<Symbol, int>
        {
            { Symbol.Lemon, 4 },
            { Symbol.Cherry, 4 },
            { Symbol.Bell, 3 },
            { Symbol.Diamond, 2 },
            { Symbol.Seven, 1 }
        };

        Symbols = weights
            .SelectMany(entry => Enumerable.Repeat(entry.Key, entry.Value))
            .ToList()
            .AsReadOnly();
    }
}
