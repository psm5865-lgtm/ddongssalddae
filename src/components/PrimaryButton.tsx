import { ButtonHTMLAttributes } from 'react';
import styles from './PrimaryButton.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function PrimaryButton({
  variant = 'primary',
  className,
  ...rest
}: Props) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className ?? ''}`}
      {...rest}
    />
  );
}
