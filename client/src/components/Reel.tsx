import { useState, useEffect } from "react";
import type { SymbolName } from "../types/slot";

export interface ReelsProps {
  symbol: SymbolName;
  isSpinning: boolean;
  isWin: boolean;
}

const SYMBOL_ICONS: Record<SymbolName, string> = {
  Lemon: "🍋",
  Cherry: "🍒",
  Bell: "🔔",
  Diamond: "💎",
  Seven: "7️⃣",
};

const ALL_SYMBOLS: SymbolName[] = [
  "Lemon",
  "Cherry",
  "Bell",
  "Diamond",
  "Seven",
];

export function Reel({ symbol, isSpinning, isWin }: ReelsProps) {
  const [spinningSymbol, setSpinningSymbol] = useState<SymbolName>(symbol);

  useEffect(() => {
    if (!isSpinning) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ALL_SYMBOLS.length);
      setSpinningSymbol(ALL_SYMBOLS[randomIndex]);
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, [isSpinning]);

  const activeSymbol = isSpinning ? spinningSymbol : symbol;

  return (
    <div
      className={`relative flex h-36 w-28 sm:h-44 sm:w-36 items-center justify-center rounded-2xl border-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-inner transition-all duration-300 ${
        isWin && !isSpinning
          ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-105"
          : "border-slate-700"
      }`}
    >
      {/* Sombra interna superior e inferior para dar profundidade de cilindro 3D */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-xl bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-xl bg-gradient-to-t from-black/70 to-transparent" />

      {/* Ícone do Símbolo */}
      <span
        className={`select-none text-6xl sm:text-7xl transition-transform duration-150 ${
          isSpinning ? "blur-[2px] scale-90 animate-pulse" : "scale-100"
        }`}
      >
        {SYMBOL_ICONS[activeSymbol]}
      </span>
    </div>
  );
}
