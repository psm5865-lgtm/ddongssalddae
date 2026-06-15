import { motion } from 'framer-motion';
import { RARITY_LABEL, CATEGORY_LABEL, type CollectItem } from '../collection/items';
import styles from './GachaReveal.module.css';

export function GachaReveal({ item, isNew }: { item: CollectItem; isNew: boolean }) {
  return (
    <div className={`${styles.wrap} ${styles[item.rarity]}`}>
      <div className={styles.label}>
        {isNew ? '✨ 새로 획득!' : '또 나왔어요 (중복)'}
      </div>
      <motion.div
        className={styles.tile}
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.05 }}
      >
        <span className={styles.emoji}>{item.emoji}</span>
      </motion.div>
      <div className={styles.meta}>
        <span className={styles.rarity}>{RARITY_LABEL[item.rarity]}</span>
        <span className={styles.cat}>{CATEGORY_LABEL[item.category]}</span>
      </div>
      <div className={styles.name}>{item.name}</div>
    </div>
  );
}
