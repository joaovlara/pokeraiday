import { useState, useCallback } from "react";
import { BattleState, Pokemon, Move } from "@/types/pokemon";

const initialState: BattleState = {
  p1: null,
  p2: null,
  hp1: null,
  hp2: null,
  moves1: [],
  moves2: [],
  winner: "",
  loading: true,
  lastAction: "",
};

export function useBattle() {
  const [state, setState] = useState<BattleState>(initialState);

  const setP1 = useCallback((pokemon: Pokemon) => {
    setState((prev) => ({ ...prev, p1: pokemon }));
  }, []);

  const setP2 = useCallback((pokemon: Pokemon) => {
    setState((prev) => ({ ...prev, p2: pokemon }));
  }, []);

  const setHp1 = useCallback((hp: number) => {
    setState((prev) => ({ ...prev, hp1: hp }));
  }, []);

  const setHp2 = useCallback((hp: number) => {
    setState((prev) => ({ ...prev, hp2: hp }));
  }, []);

  const setMoves1 = useCallback((moves: Move[]) => {
    setState((prev) => ({ ...prev, moves1: moves }));
  }, []);

  const setMoves2 = useCallback((moves: Move[]) => {
    setState((prev) => ({ ...prev, moves2: moves }));
  }, []);

  const setWinner = useCallback((winner: string) => {
    setState((prev) => ({ ...prev, winner }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setLastAction = useCallback((action: string) => {
    setState((prev) => ({ ...prev, lastAction: action }));
  }, []);

  const resetBattle = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setP1,
    setP2,
    setHp1,
    setHp2,
    setMoves1,
    setMoves2,
    setWinner,
    setLoading,
    setLastAction,
    resetBattle,
  };
}
