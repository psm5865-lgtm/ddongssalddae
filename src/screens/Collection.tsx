import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { Mascot } from '../components/Mascot';
import { ITEMS, CATEGORY_LABEL, type ItemCategory } from '../collection/items';
import { useCollection, ownedCount, TOTAL_ITEMS } from '../store/collection';
import { useRecords } from '../store/records';
import styles from './Collection.module.css';

const CATEGORIES: ItemCategory[] = ['skin', 'hat', 'accessory'];

export function Collection() {
  const navigate = useNavigate();
  const [records] = useRecords();
  const { state, toggleEquip } = useCollection();
  const total = records.length;
  const owned = ownedCount(state);

  return (
    <div className="screen">
      <div className={styles.topBar}>
        <button
          className={styles.back}
          onClick={() => navigate('/home')}
          aria-label="뒤로"
        >
          ‹
        </button>
        <span className={styles.topTitle}>똥 도감</span>
        <span className={styles.spacer} />
      </div>

      <div className={styles.preview}>
        <Mascot total={total} equipped={state.equipped} coreSize={92} />
        <div className={styles.count}>
          {owned} <span className={styles.countTotal}>/ {TOTAL_ITEMS} 수집</span>
        </div>
        <p className={styles.hint}>가진 걸 눌러 뿌직이에게 꾸며줘요 (다시 누르면 벗기)</p>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat} className={styles.group}>
          <div className={styles.groupTitle}>{CATEGORY_LABEL[cat]}</div>
          <div className={styles.grid}>
            {ITEMS.filter((i) => i.category === cat).map((item) => {
              const isOwned = (state.owned[item.id] ?? 0) > 0;
              const isEquipped = state.equipped[cat] === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    styles.cell,
                    styles[item.rarity],
                    isOwned ? '' : styles.locked,
                    isEquipped ? styles.equipped : '',
                  ].join(' ')}
                  disabled={!isOwned}
                  onClick={() => toggleEquip(cat, item.id)}
                >
                  <span className={styles.cellEmoji}>
                    {isOwned ? item.emoji : '❓'}
                  </span>
                  <span className={styles.cellName}>
                    {isOwned ? item.name : '???'}
                  </span>
                  {isEquipped && <span className={styles.badge}>착용중</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className={styles.footer}>
        <PrimaryButton variant="secondary" onClick={() => navigate('/home')}>
          홈으로
        </PrimaryButton>
      </div>
    </div>
  );
}
