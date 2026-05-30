import styles from './TextEntry.module.css';

type Props = {
  prompt: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
};

export function TextEntry({
  prompt,
  placeholder,
  value,
  onChange,
  maxLength = 140,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.prompt}>{prompt}</div>
      <div className={styles.fieldWrap}>
        <textarea
          className={styles.textarea}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className={styles.counter}>
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
