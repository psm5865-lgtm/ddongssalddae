import { useState } from 'react';
import type { OXQuiz } from '../activities/oxquiz';
import styles from './OXQuizCard.module.css';

export function OXQuizCard({
  quiz,
  onAnswered,
}: {
  quiz: OXQuiz;
  onAnswered: () => void;
}) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const answered = picked !== null;
  const correct = picked === quiz.answer;

  const choose = (v: boolean) => {
    if (answered) return;
    setPicked(v);
    onAnswered();
  };

  const cls = (v: boolean) =>
    [
      styles.ox,
      answered && quiz.answer === v ? styles.right : '',
      answered && picked === v && !correct ? styles.wrong : '',
    ].join(' ');

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>OX 퀴즈</div>
      <p className={styles.q}>{quiz.q}</p>
      <div className={styles.btns}>
        <button
          type="button"
          className={cls(true)}
          onClick={() => choose(true)}
          disabled={answered}
        >
          O
        </button>
        <button
          type="button"
          className={cls(false)}
          onClick={() => choose(false)}
          disabled={answered}
        >
          X
        </button>
      </div>
      {answered && (
        <div className={styles.result}>
          <div className={styles.verdict}>{correct ? '정답! 🎉' : '땡! 😅'}</div>
          <p className={styles.explain}>{quiz.explain}</p>
        </div>
      )}
    </div>
  );
}
