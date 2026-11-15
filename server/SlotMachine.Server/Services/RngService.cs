using System.Security.Cryptography;

namespace SlotMachine.Server.Services;

public class RngService : IRngService
{
    public int GetRandomIndex(int maxExclusive)
    {
        return RandomNumberGenerator.GetInt32(maxExclusive);
    }
}
