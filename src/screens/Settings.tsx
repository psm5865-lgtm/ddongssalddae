import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSettings } from '../store/settings';
import { NOTIFY_STANCE } from '../content/notifications';
import styles from './Settings.module.css';

const TIME_OPTIONS: (3 | 5 | 7)[] = [3, 5, 7];

export function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useSettings();

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
        <span className={styles.topTitle}>설정</span>
        <span className={styles.spacer} />
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>알림</div>
          <div className={styles.stanceCard}>
            <div className={styles.stanceTitle}>{NOTIFY_STANCE.title}</div>
            <p className={styles.stanceBody}>{NOTIFY_STANCE.body}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>기본 설정</div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>닉네임</span>
            <input
              className={styles.fieldInput}
              type="text"
              maxLength={12}
              placeholder="그대"
              value={settings.nickname}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, nickname: e.target.value }))
              }
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>세션 시간</span>
            <div className={styles.timeChips}>
              {TIME_OPTIONS.map((m) => (
                <button
                  type="button"
                  key={m}
                  className={`${styles.chip} ${
                    settings.limitMin === m ? styles.chipActive : ''
                  }`}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, limitMin: m }))
                  }
                >
                  {m}분
                </button>
              ))}
            </div>
          </div>
        </section>

        <a className={styles.privacyLink} href="/privacy.html">
          개인정보처리방침
        </a>
      </div>

      <div className={styles.footer}>
        <PrimaryButton onClick={() => navigate('/home')}>완료</PrimaryButton>
      </div>
    </div>
  );
}
