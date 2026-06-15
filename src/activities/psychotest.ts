// 한 컷 심리테스트 — 고르면 드립 결과. 가볍게 웃고 넘기는 용도.
export type PsychoOption = { label: string; result: string };
export type PsychoTest = { q: string; options: PsychoOption[] };

export const PSYCHO_TESTS: PsychoTest[] = [
  {
    q: '지금 휴지는 어떻게 쓰는 편?',
    options: [
      { label: '돌돌 말아서', result: '계획형 인간. 뭐든 각 잡아야 직성이 풀려요.' },
      { label: '대충 뭉쳐서', result: '자유로운 영혼. 디테일보다 큰 그림파.' },
      { label: '딱 필요한 만큼', result: '실속형. 군더더기 없이 핵심만 챙기는 타입.' },
    ],
  },
  {
    q: '변기에 앉으면 폰으로 주로?',
    options: [
      { label: '유튜브·숏폼', result: '도파민 사냥꾼. 그래서 이 앱 깔았잖아요 ㅎㅎ' },
      { label: '메신저 확인', result: '관계 중심형. 사람 챙기느라 늘 바빠요.' },
      { label: '아무것도 안 함', result: '득도한 사람. 이미 디톡스 고수예요.' },
    ],
  },
  {
    q: '오늘 컨디션을 음식으로 고른다면?',
    options: [
      { label: '뜨끈한 국밥', result: '든든·안정 추구. 기본기에 충실한 하루를 보내요.' },
      { label: '매운 떡볶이', result: '자극이 필요한 날. 작은 도전 하나 해봐요.' },
      { label: '시원한 냉면', result: '리프레시 모드. 머리 식히는 게 우선이에요.' },
    ],
  },
  {
    q: '일이 막혔을 때 나는?',
    options: [
      { label: '일단 들이박는다', result: '돌파형. 추진력은 최고지만 가끔 숨도 쉬어요.' },
      { label: '잠깐 멈추고 본다', result: '전략형. 한 발 물러서서 보는 지혜가 있어요.' },
      { label: '남한테 물어본다', result: '협업형. 혼자 끙끙대지 않는 게 강점이에요.' },
    ],
  },
  {
    q: '주말의 이상적인 모습은?',
    options: [
      { label: '집에서 뒹굴', result: '충전형. 혼자만의 시간이 곧 보약이에요.' },
      { label: '밖에서 약속', result: '에너지 충전을 사람에게서. 활력왕이에요.' },
      { label: '계획 빽빽하게', result: '갓생러. 쉬는 날도 알차게 쓰는 타입.' },
    ],
  },
  {
    q: '지금 가장 비우고 싶은 건?',
    options: [
      { label: '머릿속 잡생각', result: '생각 과부하. 오늘은 호흡 한 번이 약이에요.' },
      { label: '밀린 할 일', result: '책임감 만렙. 딱 하나만 끝내도 충분해요.' },
      { label: '그냥 다', result: '리셋이 필요한 때. 5분이라도 온전히 쉬어가요.' },
    ],
  },
];
