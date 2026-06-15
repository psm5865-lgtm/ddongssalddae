import { useLocalStorage } from '../hooks/useLocalStorage';
import { ITEMS, type ItemCategory } from '../collection/items';

export type Equipped = Partial<Record<ItemCategory, string>>;
export type CollectionState = {
  owned: Record<string, number>;
  equipped: Equipped;
};

const KEY = 'ddongssalddae:collection';
const DEFAULT: CollectionState = { owned: {}, equipped: {} };

function merge(raw: Partial<CollectionState> | null | undefined): CollectionState {
  return {
    owned: { ...(raw?.owned ?? {}) },
    equipped: { ...(raw?.equipped ?? {}) },
  };
}

export function ownedCount(state: CollectionState): number {
  return Object.keys(state.owned).filter((id) => state.owned[id] > 0).length;
}

export const TOTAL_ITEMS = ITEMS.length;

export function useCollection() {
  const [raw, setRaw] = useLocalStorage<CollectionState>(KEY, DEFAULT);
  const state = merge(raw);

  const addItem = (id: string) =>
    setRaw((prev) => {
      const m = merge(prev);
      return { ...m, owned: { ...m.owned, [id]: (m.owned[id] ?? 0) + 1 } };
    });

  // 같은 칸을 다시 누르면 해제(토글)
  const toggleEquip = (category: ItemCategory, id: string) =>
    setRaw((prev) => {
      const m = merge(prev);
      const equipped = { ...m.equipped };
      if (equipped[category] === id) delete equipped[category];
      else equipped[category] = id;
      return { ...m, equipped };
    });

  return { state, addItem, toggleEquip };
}
