import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { useSettings } from '../store/settings';
import { NOTIFY_CONSENT, NOTIFY_STANCE } from '../content/notifications';
import styles from './Settings.module.css';

const TIME_OPTIONS: (3 | 5 | 7)[] = [3, 5, 7];

export function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useSettings();

  const toggleNotify = () => {
    setSettings((prev) => {
      const next = !prev.notify.enabled;
      // 실제 토스 미니앱에서는 여기서 알림 동의/철회 SDK를 호출해요.
      return {
        ...prev,
        notify: {
          ...prev.notify,
          enabled: next,
          consentAt: next ? Date.now() : prev.notify.consentAt,
        },
      };
    });
  };

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

          <div className={styles.row}>
            <div className={styles.rowText}>
              <div className={styles.rowLabel}>매일 마음챙김 알림</div>
              <div className={styles.rowHint}>하루 한 번, 정해진 시간에만 와요</div>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${
                settings.notify.enabled ? styles.toggleOn : ''
              }`}
              onClick={toggleNotify}
              role="switch"
              aria-checked={settings.notify.enabled}
              aria-label="매일 마음챙김 알림"
            >
              <span className={styles.knob} />
            </button>
          </div>

          {settings.notify.enabled && (
            <div className={styles.notifyDetail}>
              <div className={styles.timeRow}>
                <span className={styles.timeLabel}>알림 시간</span>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={settings.notify.time}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      notify: { ...prev.notify, time: e.target.value },
                    }))
                  }
                />
              </div>
              <p className={styles.consentNote}>
                {NOTIFY_CONSENT.sendTiming} {NOTIFY_CONSENT.withdrawPath}
              </p>
            </div>
          )}
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
