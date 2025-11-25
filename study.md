# 프로젝트 전체 코드 분석

Go + Templ 기반 정적 블로그 생성기의 모든 코드 흐름과 파일 역할을 상세히 정리했습니다.

## 1) 폴더 및 주요 파일
```text
cmd/                # 실행 엔트리포인트
  dev/main.go       # 개발용: 빌드 후 dist 정적 서버(8082)
  generator/main.go # 배포/빌드용: dist 생성만 수행
content/posts/      # Markdown 글 + YAML 프론트매터
internal/
  content/parser.go # Markdown → Post 구조체 변환
  builder/builder.go# 전체 빌드 오케스트레이션
static/             # CSS, JS 등 정적 자산 (빌드시 dist/static으로 복사)
templates/          # Templ 원본(.templ) + 생성된 Go 코드(*_templ.go)
dist/               # 빌드 결과물(HTML, search.json, static/)
study.md            # 이 문서
```

## 2) 데이터 모델 & 파서 (`internal/content/parser.go`)
- `Post` 구조체: `Title`, `Date(time.Time)`, `Description`, `Tags`, `Slug`, `Content(template.HTML)`.
- `ParsePosts(dir)` 흐름
  - `filepath.Walk`로 하위 모든 `.md` 파일 탐색, 다른 확장자는 스킵.
  - 파일을 `---` 구분자로 3등분(`bytes.SplitN(..., 3)`): 앞/뒤에 빈 문자열이 포함되므로 반드시 `---`가 두 번 있어야 함. 부족하면 `invalid markdown format` 에러.
  - 프론트매터(YAML)를 `yaml.Unmarshal`로 `Post`에 매핑. `date`는 YAML 파서가 `time.Time`으로 파싱할 수 있는 형식(예: `2025-11-25T21:00:00Z`)이어야 함.
  - 본문 Markdown을 Goldmark로 HTML 변환 후 `template.HTML`로 보관.
    - `parser.WithAttribute()`로 커스텀 속성 허용.
    - `html.WithUnsafe()`로 안전하지 않은(raw) HTML 허용(YouTube iframe 등 가능, XSS 주의).
  - `Slug`는 파일명에서 `.md` 제거한 문자열.
  - 모든 글을 날짜 내림차순으로 정렬(`sort.Slice`).

## 3) 빌드 파이프라인 (`internal/builder/builder.go`)
`Build()`가 전체 생성 작업을 담당.
- dist 초기화: `os.RemoveAll("dist")` → `os.MkdirAll("dist", 0755)`.
- 정적 자산 복사: `copyDir("static", "dist/static")`
  - `filepath.Walk`로 디렉터리/파일 생성.
  - 파일은 `io.Copy`로 원본 내용을 그대로 복사.
- 콘텐츠 파싱: `content.ParsePosts("content/posts")` 호출로 `[]Post` 확보.
- 인덱스 페이지: `templates.Index(posts).Render(ctx, dist/index.html)`.
- 검색 인덱스: `generateSearchIndex(posts)` → `dist/search.json`
  - `SearchItem`(title, slug, description, tags, date 문자열)을 JSON 배열로 직렬화.
  - 날짜 포맷은 `"January 02, 2006"`.
- 개별 글 페이지: 각 `Post`마다 `dist/posts/<slug>/index.html` 생성 후 `templates.Post(post).Render(...)`.
  - 루프 내부 `defer f.Close()`가 반복 호출되지만 프로그램 종료 시점에 모두 닫히므로 리소스 누수는 없음(대량 파일 시에는 루프 내 즉시 `f.Close()`로 바꾸는 것이 일반적).

## 4) 템플릿 계층 (`templates/*.templ`)
Templ 원본을 `templ generate`로 Go 코드(`*_templ.go`)로 변환 후 사용. 수정은 `.templ` 파일에서 수행.
- `layout.templ`
  - 공통 HTML 스켈레톤, 구글 폰트 프리커넥트, `/static/style.css` 로드.
  - 헤더 내 네비게이션(`jaeyoung0509` 로고 링크), 푸터(Copyright 2025).
  - `children...` 슬롯에 페이지별 콘텐츠 삽입.
  - DOMContentLoaded 시 모든 `<pre>`에 “Copy” 버튼 주입 → 클릭 시 `<code>` 내용을 `navigator.clipboard`로 복사하고 2초간 “Copied!” 표시.
- `index.templ`
  - 상단 검색 인풋(`id="search-input"`), 포스트 목록 컨테이너(`id="posts-list"`).
  - 각 포스트 카드에 `data-title`/`data-tags` 속성 부여(검색 JS가 활용).
  - 태그는 `/?q=<tag>` 링크로 생성(검색창과 연동), 날짜는 `"January 02, 2006"` 포맷.
  - `/static/search.js` 스크립트 로드.
- `post.templ`
  - 단일 글 뷰. 제목, 날짜, 태그 렌더링.
  - 본문은 `templ.Raw(string(post.Content))`로 그대로 출력(Goldmark에서 만들어진 HTML).

## 5) 정적 자산 (`static/`)
- `style.css`
  - 색/폰트 변수 정의(배경 `#fdfbf7`, 본문 serif, 헤더 sans).
  - 컨테이너 최대 폭 700px, 넉넉한 라인 높이/마진으로 읽기성 강조.
  - 코드 블록: 다크 배경, 모노스페이스, 우상단 Copy 버튼 위치 정의(`.copy-button` hover 시 노출).
  - 포스트 리스트 간격, 메타 정보(대문자, letter-spacing) 스타일, 태그 컬러(`--accent-color`) 등 세부 타이포그래피 설정.
  - 이미지/iframe 반응형, blockquote 테두리, 검색 입력 포커스 색상 지정.
- `search.js`
  - DOMContentLoaded 후 검색 인풋/포스트 목록 조회. 없으면 조용히 종료.
  - `filterPosts(query)`: 소문자 비교로 `data-title` 혹은 `data-tags`에 포함 여부 체크, display 토글.
  - 입력 이벤트로 실시간 필터링, URL `?q=` 파라미터를 읽어 초기 필터 적용(태그 클릭 시 동작).

## 6) 실행 엔트리포인트 (`cmd/`)
- `cmd/generator/main.go`: `builder.Build()` 실행 후 성공 메시지, 실패 시 `os.Exit(1)`. 배포/CI에서 사용.
- `cmd/dev/main.go`: 실행 시 한 번 빌드 후 `http.FileServer`로 `dist`를 8082 포트에 서빙. 빌드 에러는 stderr 로깅 후 서버는 계속 실행.

## 7) 콘텐츠 & 산출물
- 예시 글 `content/posts/lets_build_github_blog.md`
  - YAML 프론트매터 + 튜토리얼 본문을 포함. 날짜는 RFC3339 형식.
  - 본문 내용은 코드/설명 등으로 Goldmark가 HTML 변환.
- `dist/`
  - 빌드 산출물(HTML, `search.json`, 복사된 `static/`). 소스가 아닌 결과물이라 수정은 원본 파일에서 해야 함.

## 8) 의존성과 개발 흐름
- `go.mod`: `templ`, `goldmark`, `yaml.v3` 의존.
- 일반적인 작업 순서
  1. `templ generate`로 `.templ` → `*_templ.go` 생성/갱신.
  2. `go run cmd/generator/main.go`로 정적 사이트 빌드(또는 `go run cmd/dev/main.go`로 빌드+서빙).
  3. 결과는 `dist/`에서 확인하거나 `http://localhost:8082` 접속.

## 9) 주의/확장 포인트
- 프론트매터는 `---`로 정확히 감싸야 하고, `date`는 `time.Time`으로 파싱 가능한 형식이어야 함.
- `html.WithUnsafe()`를 사용하므로 Markdown에 포함된 raw HTML은 그대로 렌더링됨(XSS 위험이 있는 콘텐츠는 신뢰된 글만 사용).
- 빌드 루프의 `defer f.Close()`는 파일 수가 많아지면 열린 fd가 일시적으로 많아질 수 있음. 필요 시 루프 내에서 즉시 닫는 방식으로 변경 가능.
- 검색은 제목/태그 문자열에만 의존하며 `search.json`을 다운로드하지 않는 순수 DOM 필터링이므로 클라이언트에만 목록이 있는 현재 구조와 잘 맞음. 향후 본문 검색을 원하면 `search.json`에 본문 요약을 추가하고 JS를 수정하면 됨.
