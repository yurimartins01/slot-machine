namespace SlotMachine.Server.Domain;

public class PlayerSession
{
    public string ConnectionId { get; }
    public decimal CurrentBalance { get; private set; }
    public object LockObject { get; } = new();

    public PlayerSession(string connectionId, decimal inicialBalance = 1000m)
    {
        ConnectionId = connectionId;
        CurrentBalance = inicialBalance;
    }

    public bool TryDebit(decimal amount)
    {
        if (amount <= 0 || CurrentBalance < amount)
        {
            return false;
        }

        CurrentBalance -= amount;
        return true;
    }

    public void Credit(decimal amount)
    {
        if (amount > 0)
        {
            CurrentBalance += amount;
        }
    }

}
