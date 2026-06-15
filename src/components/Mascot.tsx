import { stageForCount, type Condition } from '../mascot/stages';
import { ITEMS_BY_ID } from '../collection/items';
import type { Equipped } from '../store/collection';
import styles from './Mascot.module.css';

type Props = {
  total: number;
  equipped: Equipped;
  condition?: Condition;
  /** 코어 이모지 크기(px). 무대는 이 값의 2배. */
  coreSize?: number;
  onTap?: () => void;
};

export function Mascot({
  total,
  equipped,
  condition = 'ok',
  coreSize = 92,
  onTap,
}: Props) {
  const stage = stageForCount(total);
  const skin = equipped.skin ? ITEMS_BY_ID[equipped.skin] : undefined;
  const hat = equipped.hat ? ITEMS_BY_ID[equipped.hat] : undefined;
  const acc = equipped.accessory ? ITEMS_BY_ID[equipped.accessory] : undefined;
  const aura = skin?.aura ?? stage.aura;

  return (
    <button
      type="button"
      className={`${styles.stage} ${styles[condition]}`}
      style={{ fontSize: coreSize }}
      onClick={onTap}
      disabled={!onTap}
      aria-label={`${stage.name}`}
    >
      {aura && <span className={styles.aura} style={{ background: aura }} />}
      {hat && <span className={styles.hat}>{hat.emoji}</span>}
      <span className={styles.core}>{stage.emoji}</span>
      {acc && <span className={styles.acc}>{acc.emoji}</span>}
    </button>
  );
}
