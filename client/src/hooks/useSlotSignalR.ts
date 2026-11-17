import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import type { SpinRequest, SpinResponse } from "../types/slot";

const HUB_URL = import.meta.env.VITE_API_URL || "http://localhost:5035/slothub";


export function useSlotSignalR() {
  const [balance, setBalance] = useState<number>(0);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {


    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveInitialBalance", (initialBalance: number) => {
      setBalance(initialBalance);
    });

    newConnection
      .start()
      .then(() => {
        setIsConnected(true);
        setConnection(newConnection);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao conectar no signalR: ", err);
        setError("Não foi possível conectar no servidor.");
      });

    return () => {
      newConnection.stop();
    };
  }, []);

  const spin = async (betAmount: number): Promise<SpinResponse | null> => {
    if (!connection || !isConnected) {
      setError("Servidor desconectado.");
      return null;
    }
    setError(null);

    try {
      const request: SpinRequest = { betAmount };
      const response = await connection.invoke<SpinResponse>("Spin", request);
      setBalance(response.newBalance);
      return response;
    } catch (err: any) {
      const rawMessage = err?.message || "Erro ao realizar jogada.";
      const cleanMessage = rawMessage.includes("HubException:")
        ? rawMessage.split("HubException:")[1].trim()
        : rawMessage;

      setError(cleanMessage);
      return null;
    }
  };
  return { balance, isConnected, error, spin };
}
