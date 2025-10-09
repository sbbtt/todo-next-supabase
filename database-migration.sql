-- 기존 todos 테이블 삭제 (데이터가 있다면 백업 후 삭제)
DROP TABLE IF EXISTS todos;

-- 새로운 todos 테이블 생성 (auto-increment ID 사용)
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거 추가
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 개발용 정책 (모든 사용자 접근 허용)
CREATE POLICY "Allow all users read access" ON todos
FOR SELECT USING (true);

CREATE POLICY "Allow all users insert access" ON todos
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all users update access" ON todos
FOR UPDATE USING (true);

CREATE POLICY "Allow all users delete access" ON todos
FOR DELETE USING (true);
