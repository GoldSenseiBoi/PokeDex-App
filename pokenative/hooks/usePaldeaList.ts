import { useCallback, useEffect, useRef, useState } from 'react';
import type { PokemonType } from '../constants/pokedex';
import { getPaldeaEntries, getPokemonCard, getPokemonNamesByType } from '../services/pokedex';
import type { PokemonCardData } from '../types/pokemon';

const PAGE_SIZE = 24;

type DexEntry = { number: number; name: string };

export function usePaldeaList() {
  const [allEntries, setAllEntries] = useState<DexEntry[]>([]);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [visibleEntries, setVisibleEntries] = useState<DexEntry[]>([]);
  const [cards, setCards] = useState<PokemonCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    getPaldeaEntries().then((entries) => {
      if (!cancelled) setAllEntries(entries);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadBatch = useCallback(async (source: DexEntry[], reset: boolean) => {
    const start = reset ? 0 : cursorRef.current;
    const batch = source.slice(start, start + PAGE_SIZE);
    if (batch.length === 0) {
      setHasMore(false);
      return;
    }
    setLoadingMore(true);
    const results = await Promise.all(batch.map((e) => getPokemonCard(e.name).catch(() => null)));
    const valid = results.filter((c): c is PokemonCardData => c !== null);
    cursorRef.current = start + batch.length;
    setCards((prev) => (reset ? valid : [...prev, ...valid]));
    setHasMore(cursorRef.current < source.length);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    if (allEntries.length === 0) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      let source = allEntries;
      if (typeFilter) {
        const names = await getPokemonNamesByType(typeFilter);
        source = allEntries.filter((e) => names.has(e.name));
      }
      if (cancelled) return;
      setVisibleEntries(source);
      cursorRef.current = 0;
      setCards([]);
      await loadBatch(source, true);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [allEntries, typeFilter, loadBatch]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    loadBatch(visibleEntries, false);
  }, [loading, loadingMore, hasMore, visibleEntries, loadBatch]);

  return {
    cards,
    loading,
    loadingMore,
    loadMore,
    hasMore,
    typeFilter,
    setTypeFilter,
    total: visibleEntries.length,
  };
}
