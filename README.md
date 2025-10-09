# Todo App - Next.js 15 + Supabase 학습 프로젝트

React에서 Next.js로 전환하며 배운 것들을 정리한 Todo 애플리케이션

## 프로젝트 목표

기존 React 프로젝트에서 Next.js 15로 전환하며 다음 사항들을 학습하고 비교해보기:

- React vs Next.js 차이점과 장점
- App Router 구조와 라우팅 방식
- Server Components vs Client Components
- API Routes를 통한 백엔드 구현
- Supabase를 활용한 데이터베이스 연동
- Next.js 15의 새로운 문법과 특성

## 주요 기능

### 완전한 CRUD 기능
- Create: 새로운 할 일 추가
- Read: 할 일 목록 조회 (미완료 우선 정렬)
- Update: 할 일 수정 (인라인 편집)
- Delete: 할 일 삭제 (확인 대화상자)

### 사용자 경험 (UX)
- Optimistic Updates: 즉시 UI 반영, 백그라운드 API 호출
- 스마트 정렬: 미완료 할 일이 위에, 완료된 할 일이 아래에
- 반응형 디자인: Tailwind CSS로 모바일/데스크톱 지원
- 로딩 상태: 초기 로딩만 표시, 업데이트 시 기존 데이터 유지

### 기술적 특징
- TypeScript: 타입 안전성 보장
- 에러 처리: 사용자 친화적 에러 메시지
- 실시간 업데이트: 상태 변경 시 즉시 반영

## 기술 스택

### Frontend
- Next.js 15.5.3 - React 프레임워크
- TypeScript - 타입 안전성
- Tailwind CSS - 스타일링
- React 19 - UI 라이브러리

### Backend
- Supabase - PostgreSQL 기반 백엔드 서비스
- Next.js API Routes - RESTful API 구현
- Row Level Security (RLS) - 데이터베이스 보안

## React vs Next.js 비교

### React (기존 방식)
```jsx
// 단순한 React 컴포넌트
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    fetch('/api/todos').then(res => res.json())
      .then(data => setTodos(data));
  }, []);
  
  return <div>{/* UI */}</div>;
}
```

### Next.js (현재 방식)
```tsx
// App Router 구조
app/
  todo/
    list/
      page.tsx          // 페이지 컴포넌트
  api/
    todos/
      route.ts          // API 엔드포인트
      [id]/
        route.ts        // 동적 라우트

// Server Component (기본)
export default function TodoList() {
  // 서버에서 실행, SEO 최적화
}

// Client Component (상호작용 필요시)
'use client';
export default function InteractiveTodo() {
  // 클라이언트에서 실행, 상태 관리 가능
}
```

### 주요 차이점

| 구분 | React | Next.js |
|------|-------|---------|
| 라우팅 | React Router | 파일 기반 라우팅 |
| 렌더링 | 클라이언트 사이드 | 서버/클라이언트 선택 가능 |
| API | 별도 백엔드 필요 | API Routes 내장 |
| SEO | 추가 설정 필요 | 기본 지원 |
| 성능 | 번들 크기 큼 | 자동 최적화 |
| 배포 | 복잡한 설정 | Vercel 원클릭 배포 |

## Supabase 선택 이유

### 기존 방식의 문제점
```javascript
// 로컬 JSON 파일 또는 간단한 상태 관리
const todos = [
  { id: 1, title: "할 일 1", completed: false },
  { id: 2, title: "할 일 2", completed: true }
];
```

### Supabase의 장점

1. 실제 데이터베이스: PostgreSQL 기반
2. 자동 API 생성: REST API 자동 제공
3. 실시간 기능: WebSocket 기반 실시간 업데이트
4. 인증 시스템: 내장된 사용자 인증
5. 보안: Row Level Security (RLS) 정책
6. 무료 티어: 월 50,000 요청까지 무료

### Supabase 설정
```sql
-- 데이터베이스 스키마
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 (개발용)
CREATE POLICY "Allow all users access" ON todos
FOR ALL USING (true);
```

## 프로젝트 구조

```
n2/
├── app/                    # App Router 디렉토리
│   ├── api/               # API Routes
│   │   └── todos/
│   │       ├── route.ts   # GET, POST /api/todos
│   │       └── [id]/
│   │           └── route.ts # GET, PUT, DELETE /api/todos/[id]
│   ├── todo/
│   │   └── list/
│   │       └── page.tsx   # Todo 목록 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── lib/
│   └── supabaseClient.ts  # Supabase 클라이언트 설정
├── types/
│   └── todo.ts           # TypeScript 타입 정의
└── database-migration.sql # 데이터베이스 스키마
```

## Next.js 15 새로운 특성

### 1. Dynamic Route Parameters
```typescript
// Next.js 14 (이전)
{ params }: { params: { id: string } }
const { id } = params;

// Next.js 15 (현재)
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

### 2. App Router 기본 구조
- app/ 디렉토리 사용
- page.tsx 파일로 라우트 정의
- route.ts 파일로 API 엔드포인트 정의

### 3. Server Components vs Client Components
```typescript
// Server Component (기본값)
export default function Page() {
  // 서버에서 실행, SEO 최적화
}

// Client Component (상호작용 필요시)
'use client';
export default function InteractivePage() {
  // 클라이언트에서 실행, 상태 관리 가능
}
```

## UI/UX 개선사항

### Optimistic Updates
```typescript
const toggleTodo = async (id: number, completed: boolean) => {
  // 즉시 UI 업데이트
  setTodos(prevTodos => 
    prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !completed } : todo
    )
  );

  try {
    // 백그라운드에서 API 호출
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: !completed })
    });
  } catch (error) {
    // 에러 시 원래 상태로 복원
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: completed } : todo
      )
    );
  }
};
```

### 스마트 정렬
```typescript
// 미완료 할 일이 위에, 완료된 할 일이 아래에
.order('completed', { ascending: true })
.order('created_at', { ascending: false })
```

## 배포 방법

### Vercel 배포 (추천)
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### 환경 변수 설정
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 학습 포인트

### 1. 프레임워크 전환의 장점
- 더 나은 개발자 경험
- 내장된 최적화 기능
- 간편한 배포 과정

### 2. 현대적인 백엔드 선택
- Supabase의 BaaS (Backend as a Service) 장점
- 데이터베이스 관리의 복잡성 제거
- 실시간 기능의 쉬운 구현

### 3. 사용자 경험 개선
- Optimistic Updates로 즉시 반응
- 스마트한 상태 관리
- 에러 처리와 복구 메커니즘

## 향후 개선 계획

- 사용자 인증 시스템 추가
- 실시간 협업 기능
- 할 일 카테고리 및 태그
- 마감일 및 알림 기능
- 다크 모드 지원

## 참고 자료

- [Next.js 15 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

---

이 프로젝트는 React에서 Next.js로의 전환 과정을 학습하기 위해 만들어졌습니다. 각 기술의 장단점을 비교하고, 현대적인 웹 개발 패턴을 익히는 것이 목표입니다.