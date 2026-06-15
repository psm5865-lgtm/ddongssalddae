// 이번 주 활동량 기반 드립 칭호.
export type WeeklyTitle = { title: string; sub: string };

export function weeklyTitle(weekCount: number): WeeklyTitle {
  if (weekCount >= 6)
    return { title: '변기 위의 도(道)', sub: '경지에 올랐어요. 이제 절로 비워집니다.' };
  if (weekCount >= 4)
    return { title: '변기 위 현자', sub: '이쯤 되면 숏폼이 시시하죠.' };
  if (weekCount >= 2)
    return { title: '꾸준한 비움러', sub: '리듬을 탔어요. 아주 좋아요.' };
  if (weekCount >= 1)
    return { title: '시동 거는 중', sub: '한 번이 어렵지, 두 번은 쉬워요.' };
  return { title: '이번 주 데뷔 대기', sub: '딱 한 번만 앉아보면 시작이에요.' };
}
