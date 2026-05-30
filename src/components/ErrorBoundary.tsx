import { Component, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // 프로덕션에서는 여기서 에러 리포팅 도구(Sentry 등)로 전송할 수 있어요.
    if (import.meta.env.DEV) {
      console.error(error);
    }
  }

  handleReset = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <div className={styles.emoji}>🌀</div>
          <h1 className={styles.title}>잠시 길을 잃었어요</h1>
          <p className={styles.body}>
            화면을 불러오는 데 문제가 생겼어요.
            <br />
            다시 처음부터 시작해 주세요.
          </p>
          <button className={styles.btn} onClick={this.handleReset}>
            처음으로
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
