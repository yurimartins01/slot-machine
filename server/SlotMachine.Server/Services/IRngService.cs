namespace SlotMachine.Server.Services;

public interface IRngService
{
    public int GetRandomIndex(int maxExclusive);
}
