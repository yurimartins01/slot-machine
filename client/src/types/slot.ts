
export type SymbolName = "Lemon" | "Cherry" | "Bell" | "Diamond" | "Seven";

export interface SpinRequest 
{
    betAmount: number;
}

export interface SpinResponse 
{
    reels: SymbolName[];
    payout: number;
    newBalance: number;
    isWin: boolean;

}