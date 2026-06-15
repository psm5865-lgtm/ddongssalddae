// OX 퀴즈 — 탭 한 번, 작은 승리. 정답 후 한 줄 해설.
export type OXQuiz = { q: string; answer: boolean; explain: string };

export const OX_QUIZZES: OXQuiz[] = [
  { q: '문어의 심장은 3개다.', answer: true, explain: '맞아요! 두 개는 아가미로, 하나는 온몸으로 피를 보내요.' },
  { q: '금붕어 기억력은 딱 3초다.', answer: false, explain: '낭설이에요. 사실 몇 달까지도 기억해요.' },
  { q: '꿀은 시간이 지나도 잘 상하지 않는다.', answer: true, explain: '맞아요. 수천 년 된 꿀도 먹을 수 있을 만큼 보존성이 좋아요.' },
  { q: '바나나는 식물학적으로 베리(berry)다.', answer: true, explain: '맞아요. 반대로 딸기는 베리가 아니에요.' },
  { q: '북극곰의 피부는 하얀색이다.', answer: false, explain: '사실 피부는 검은색, 털은 투명해요.' },
  { q: '우주 공간에서는 소리가 들리지 않는다.', answer: true, explain: '맞아요. 소리를 전달할 공기가 없어서예요.' },
  { q: '하품은 글로 읽기만 해도 전염될 수 있다.', answer: true, explain: '맞아요. 지금 한 번 나오지 않았나요?' },
  { q: '벌은 사람 얼굴을 기억하지 못한다.', answer: false, explain: '사실 벌은 사람 얼굴을 기억할 수 있어요.' },
  { q: '해달은 잠잘 때 서로 손을 잡고 잔다.', answer: true, explain: '맞아요. 떠내려가지 않으려고요. 귀엽죠.' },
  { q: '에펠탑은 여름에 키가 더 커진다.', answer: true, explain: '맞아요. 열팽창으로 15cm까지 커져요.' },
  { q: '사람 몸의 원소 대부분은 별에서 만들어졌다.', answer: true, explain: '맞아요. 우리는 별먼지로 이루어져 있어요.' },
  { q: '홍학은 원래 분홍색으로 태어난다.', answer: false, explain: '먹이 때문에 분홍색이 돼요. 안 먹으면 하얘져요.' },
  { q: '달팽이는 몇 년씩 잠을 잘 수 있다.', answer: true, explain: '맞아요. 환경이 안 좋으면 오래 잠들어요.' },
  { q: '바다거북은 태어난 해변을 못 찾아온다.', answer: false, explain: '지구 자기장을 느껴 태어난 해변으로 돌아와요.' },
  { q: '위(胃) 점막은 며칠마다 새로 만들어진다.', answer: true, explain: '맞아요. 위산에 자기 위가 녹지 않게요.' },
  { q: '카페인은 물보다 가볍다.', answer: false, explain: '관계없는 말이에요. 속지 마세요 ㅎㅎ' },
];
