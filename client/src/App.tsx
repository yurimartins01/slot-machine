import { useState } from "react";
import { useSlotSignalR } from "./hooks/useSlotSignalR";
import { type SymbolName } from "./types/slot";
import { Reel } from "./components/Reel";

export function App() {
  const { balance, isConnected, error, spin } = useSlotSignalR();

  const [reels, setReels] = useState<SymbolName[]>(["Seven", "Seven", "Seven"]);
  const [spinningReels, setSpinningReels] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [lastWin, setLastWin] = useState<number>(0);
  const [pendingBalance, setPendingBalance] = useState<number | null>(null);

  const currentDisplayBalance = pendingBalance ?? balance;


  const isAnySpinning = spinningReels.some((spinning) => spinning);

  const canSpin = isConnected && !isAnySpinning && balance >= betAmount;

  const handleSpin = async () => {
    if (!canSpin) return;

    setLastWin(0);
    setPendingBalance(balance - betAmount);
    setSpinningReels([true, true, true]);

    const response = await spin(betAmount);

    if (!response) {
      setPendingBalance(null);
      setSpinningReels([false, false, false]);
      return;
    }

    setReels(response.reels);
    setTimeout(() => {
      setSpinningReels([false, true, true]);
    }, 500);
    setTimeout(() => {
      setSpinningReels([false, false, true]);
    }, 900);
    setTimeout(() => {
      setSpinningReels([false, false, false]);
      setLastWin(response.payout);
      setPendingBalance(null);
    }, 1300);
  };

    return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      {/* Cabeçalho com Status da Conexão */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300">
          CLASSIC VEGAS SLOTS
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-400 animate-ping" : "bg-red-500"}`} />
          <span className="text-slate-400">
            {isConnected ? "Conectado ao Servidor RPC" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Gabinete Principal da Máquina */}
      <div className="w-full max-w-xl rounded-3xl border-4 border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        
        {/* Visor de Saldo e Último Prêmio */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Saldo Atual</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
              R$ {currentDisplayBalance.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-400">Último Ganho</p>
            <p className={`text-2xl sm:text-3xl font-bold ${lastWin > 0 ? "text-amber-400 animate-bounce" : "text-slate-600"}`}>
              R$ {lastWin.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Área dos 3 Rolos com Linha de Pagamento Central */}
        <div className="relative my-8 flex items-center justify-center gap-3 sm:gap-5">
          {/* Linha vermelha atravessando o centro */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-red-500/60 z-10 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          
          {reels.map((symbol, index) => (
            <Reel
              key={index}
              symbol={symbol}
              isSpinning={spinningReels[index]}
              isWin={lastWin > 0}
            />
          ))}
        </div>

        {/* Mensagem de Erro (Caso o C# lance HubException) */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/50 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Controles de Aposta e Botão GIRAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 mr-1">Aposta:</span>
            {[10, 25, 50, 100].map((value) => (
              <button
                key={value}
                onClick={() => setBetAmount(value)}
                disabled={isAnySpinning}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                  betAmount === value
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            onClick={handleSpin}
            disabled={!canSpin}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg tracking-wider uppercase transition-all bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 hover:from-emerald-400 hover:to-green-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            {isAnySpinning ? "Girando..." : balance < betAmount ? "RECARREGUE" : "GIRAR"}

          </button>
        </div>
      </div>

      {/* Tabela de Pagamentos (Paytable) */}
      <div className="mt-6 w-full max-w-xl rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-xs text-slate-400">
        <p className="font-bold text-slate-300 uppercase mb-2 text-center">Tabela de Prêmios (Paytable)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/60 p-2 rounded-lg">7️⃣ 7️⃣ 7️⃣ = <span className="text-amber-400 font-bold">50x</span></div>
          <div className="bg-slate-950/60 p-2 rounded-lg">💎 💎 💎 = <span className="text-amber-400 font-bold">25x</span></div>
          <div className="bg-slate-950/60 p-2 rounded-lg">🔔 🔔 🔔 = <span className="text-amber-400 font-bold">10x</span></div>
          <div className="bg-slate-950/60 p-2 rounded-lg">🍒 🍒 🍒 = <span className="text-amber-400 font-bold">5x</span></div>
          <div className="bg-slate-950/60 p-2 rounded-lg">🍋 🍋 🍋 = <span className="text-amber-400 font-bold">3x</span></div>
          <div className="bg-slate-950/60 p-2 rounded-lg">Par 🍒 ou 🍋 = <span className="text-emerald-400 font-bold">1.15x</span></div>
        </div>
      </div>
    </div>
  );

}

export default App;