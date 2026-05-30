import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSettings } from '../store/settings';
import styles from './Onboarding.module.css';

const TIME_OPTIONS: { value: 3 | 5 | 7; hint: string }[] = [
  { value: 3, hint: '짧게' },
  { value: 5, hint: '권장' },
  { value: 7, hint: '여유' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [, setSettings] = useSettings();
  const [nickname, setNickname] = useState('');
  const [limitMin, setLimitMin] = useState<3 | 5 | 7>(5);

  const handleStart = () => {
    setSettings((prev) => ({
      ...prev,
      nickname: nickname.trim(),
      limitMin,
      onboarded: true,
    }));
    navigate('/home', { replace: true });
  };

  return (
    <div className="screen">
      <div className={styles.body}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>똥쌀때</div>
          <h1 className={styles.title}>
            변기 위의
            <br />
            5분 마음챙김
          </h1>
          <p className={styles.sub}>
            화장실에 가서도 핸드폰을 놓을 수 없다면, 그 시간만큼은
            <br />
            숏츠 대신 단 하나의 활동에만 머물러요.
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>어떻게 불러드릴까요?</div>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="닉네임 (선택)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={12}
            />
          </div>
          <div className={styles.sectionHint}>
            비워두시면 "그대"라고 부를게요.
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>한 세션은 몇 분이 좋을까요?</div>
          <div className={styles.timeRow}>
            {TIME_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`${styles.timeChip} ${
                  limitMin === opt.value ? styles.active : ''
                }`}
                onClick={() => setLimitMin(opt.value)}
              >
                <span className={styles.timeChip__min}>{opt.value}분</span>
                <span className={styles.timeChip__hint}>{opt.hint}</span>
              </button>
            ))}
          </div>
          <div className={styles.sectionHint}>
            의학적으로 5분 이상 변기에 앉아 있는 건 권장되지 않아요.
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={handleStart}>시작할게요</PrimaryButton>
      </div>
    </div>
  );
}
