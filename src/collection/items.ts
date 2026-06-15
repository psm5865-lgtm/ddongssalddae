// 똥 도감 — 세션 완료 시 뽑기로 모으는 수집품.
// skin: 마스코트 배경 오라(aura CSS)를 바꿈 / hat: 머리 위 이모지 / accessory: 옆 이모지.
export type Rarity = 'common' | 'rare' | 'legendary';
export type ItemCategory = 'skin' | 'hat' | 'accessory';

export type CollectItem = {
  id: string;
  name: string;
  emoji: string;
  category: ItemCategory;
  rarity: Rarity;
  aura?: string; // skin 전용: 마스코트 무대 배경(CSS background)
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: '흔함',
  rare: '희귀',
  legendary: '전설',
};

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
  skin: '스킨',
  hat: '모자',
  accessory: '장식',
};

export const ITEMS: CollectItem[] = [
  // ── 스킨(10) — 마스코트 배경 오라 ──
  { id: 'skin-pink', name: '핑크똥', emoji: '🌸', category: 'skin', rarity: 'common', aura: 'radial-gradient(circle, #FFE3EF 0%, transparent 70%)' },
  { id: 'skin-mint', name: '민트똥', emoji: '🌿', category: 'skin', rarity: 'common', aura: 'radial-gradient(circle, #DBF5EC 0%, transparent 70%)' },
  { id: 'skin-choco', name: '초코똥', emoji: '🍫', category: 'skin', rarity: 'common', aura: 'radial-gradient(circle, #EADBCB 0%, transparent 70%)' },
  { id: 'skin-injeolmi', name: '인절미똥', emoji: '🍡', category: 'skin', rarity: 'common', aura: 'radial-gradient(circle, #F3E7C9 0%, transparent 70%)' },
  { id: 'skin-zombie', name: '좀비똥', emoji: '🧟', category: 'skin', rarity: 'rare', aura: 'radial-gradient(circle, #CDEBC0 0%, transparent 70%)' },
  { id: 'skin-fire', name: '불꽃똥', emoji: '🔥', category: 'skin', rarity: 'rare', aura: 'radial-gradient(circle, #FFD9C0 0%, transparent 70%)' },
  { id: 'skin-ice', name: '얼음똥', emoji: '🧊', category: 'skin', rarity: 'rare', aura: 'radial-gradient(circle, #D7ECFB 0%, transparent 70%)' },
  { id: 'skin-space', name: '우주똥', emoji: '🌌', category: 'skin', rarity: 'rare', aura: 'radial-gradient(circle, #C9C7F0 0%, transparent 70%)' },
  { id: 'skin-gold', name: '황금똥', emoji: '✨', category: 'skin', rarity: 'legendary', aura: 'radial-gradient(circle, #FFEFB0 0%, transparent 72%)' },
  { id: 'skin-rainbow', name: '무지개똥', emoji: '🌈', category: 'skin', rarity: 'legendary', aura: 'conic-gradient(from 0deg, #FFD1D1, #FFE9C7, #D7F5C9, #CFEFFB, #E1D6FB, #FFD1D1)' },

  // ── 모자(12) — 머리 위 ──
  { id: 'hat-sprout', name: '새싹모자', emoji: '🌱', category: 'hat', rarity: 'common' },
  { id: 'hat-ribbon', name: '리본', emoji: '🎀', category: 'hat', rarity: 'common' },
  { id: 'hat-flower', name: '꽃모자', emoji: '🌸', category: 'hat', rarity: 'common' },
  { id: 'hat-star', name: '별모자', emoji: '⭐', category: 'hat', rarity: 'common' },
  { id: 'hat-straw', name: '밀짚모자', emoji: '👒', category: 'hat', rarity: 'common' },
  { id: 'hat-cap', name: '야구모자', emoji: '🧢', category: 'hat', rarity: 'common' },
  { id: 'hat-santa', name: '산타모자', emoji: '🎅', category: 'hat', rarity: 'rare' },
  { id: 'hat-grad', name: '학사모', emoji: '🎓', category: 'hat', rarity: 'rare' },
  { id: 'hat-mushroom', name: '버섯모자', emoji: '🍄', category: 'hat', rarity: 'rare' },
  { id: 'hat-magic', name: '마술사모자', emoji: '🎩', category: 'hat', rarity: 'rare' },
  { id: 'hat-crown', name: '왕관', emoji: '👑', category: 'hat', rarity: 'legendary' },
  { id: 'hat-unicorn', name: '유니콘뿔', emoji: '🦄', category: 'hat', rarity: 'legendary' },

  // ── 장식(12) — 옆/얼굴 ──
  { id: 'acc-heart', name: '하트뿅', emoji: '❤️', category: 'accessory', rarity: 'common' },
  { id: 'acc-sparkle', name: '윤슬', emoji: '✨', category: 'accessory', rarity: 'common' },
  { id: 'acc-tp', name: '두루마리 친구', emoji: '🧻', category: 'accessory', rarity: 'common' },
  { id: 'acc-soap', name: '비누', emoji: '🧼', category: 'accessory', rarity: 'common' },
  { id: 'acc-bubble', name: '거품', emoji: '🫧', category: 'accessory', rarity: 'common' },
  { id: 'acc-balloon', name: '풍선', emoji: '🎈', category: 'accessory', rarity: 'common' },
  { id: 'acc-fly', name: '파리 친구', emoji: '🪰', category: 'accessory', rarity: 'common' },
  { id: 'acc-star2', name: '별빛', emoji: '🌟', category: 'accessory', rarity: 'common' },
  { id: 'acc-sunglasses', name: '선글라스', emoji: '😎', category: 'accessory', rarity: 'rare' },
  { id: 'acc-clover', name: '네잎클로버', emoji: '🍀', category: 'accessory', rarity: 'rare' },
  { id: 'acc-beads', name: '염주', emoji: '📿', category: 'accessory', rarity: 'rare' },
  { id: 'acc-fart', name: '뿌직 효과음', emoji: '💨', category: 'accessory', rarity: 'rare' },
];

export const ITEMS_BY_ID: Record<string, CollectItem> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);

function rarityWeight(r: Rarity): number {
  return r === 'common' ? 70 : r === 'rare' ? 25 : 5;
}

function weightedPick(pool: CollectItem[]): CollectItem {
  const total = pool.reduce((s, i) => s + rarityWeight(i.rarity), 0);
  let n = Math.random() * total;
  for (const i of pool) {
    n -= rarityWeight(i.rarity);
    if (n <= 0) return i;
  }
  return pool[pool.length - 1];
}

// 미보유 우선(거의 매번 새 것). 다 모으면 중복 허용.
export function drawItem(owned: Record<string, number>): CollectItem {
  const unowned = ITEMS.filter((i) => !owned[i.id]);
  return weightedPick(unowned.length > 0 ? unowned : ITEMS);
}
