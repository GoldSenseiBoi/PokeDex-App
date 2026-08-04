import { useCallback, useEffect, useState } from 'react';
import { getEncounters, getEvolutionChain, getMoveNamesFr, getPokemonDetail } from '../services/pokedex';
import type { EncounterGroup, EvolutionNode, MoveEntry, PokemonDetail } from '../types/pokemon';

export function usePokemonDetail(idOrName: string | number) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPokemonDetail(idOrName)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [idOrName]);

  const [evolution, setEvolution] = useState<EvolutionNode | null>(null);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const loadEvolution = useCallback(() => {
    if (!detail?.evolutionChainUrl || evolution || evolutionLoading) return;
    setEvolutionLoading(true);
    getEvolutionChain(detail.evolutionChainUrl)
      .then(setEvolution)
      .finally(() => setEvolutionLoading(false));
  }, [detail, evolution, evolutionLoading]);

  const [movesByMethod, setMovesByMethod] = useState<Record<string, MoveEntry[]>>({});
  const [movesLoading, setMovesLoading] = useState<Record<string, boolean>>({});
  const loadMoves = useCallback(
    (method: string) => {
      if (!detail || movesByMethod[method] || movesLoading[method]) return;
      const refs = detail.rawMoves.filter((m) => m.method === method);
      if (method === 'level-up') refs.sort((a, b) => a.level - b.level);
      setMovesLoading((prev) => ({ ...prev, [method]: true }));
      getMoveNamesFr(refs)
        .then((entries) => setMovesByMethod((prev) => ({ ...prev, [method]: entries })))
        .finally(() => setMovesLoading((prev) => ({ ...prev, [method]: false })));
    },
    [detail, movesByMethod, movesLoading],
  );

  const [encounters, setEncounters] = useState<EncounterGroup[] | null>(null);
  const [encountersLoading, setEncountersLoading] = useState(false);
  const loadEncounters = useCallback(() => {
    if (!detail || encounters || encountersLoading) return;
    setEncountersLoading(true);
    getEncounters(detail.locationAreaEncountersUrl)
      .then(setEncounters)
      .finally(() => setEncountersLoading(false));
  }, [detail, encounters, encountersLoading]);

  return {
    detail,
    loading,
    error,
    evolution,
    evolutionLoading,
    loadEvolution,
    movesByMethod,
    movesLoading,
    loadMoves,
    encounters,
    encountersLoading,
    loadEncounters,
  };
}
