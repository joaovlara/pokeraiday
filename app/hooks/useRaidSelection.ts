// app/hooks/useRaidSelection.ts
import { useState } from "react";
import { Candidate } from "./useRaidCandidates";

export function useRaidSelection(maxTeamSize = 5) {
  const [chosen, setChosen] = useState<Candidate[]>([]);

  function toggleChoose(item: Candidate) {
    const exists = chosen.find(
      (c) => c.raw.id === item.raw.id && c.level === item.level,
    );
    if (exists) {
      setChosen((s) =>
        s.filter((c) => !(c.raw.id === item.raw.id && c.level === item.level)),
      );
    } else if (chosen.length < maxTeamSize) {
      setChosen((s) => [...s, item]);
    }
  }

  function resetSelection() {
    setChosen([]);
  }

  return { chosen, toggleChoose, resetSelection };
}
