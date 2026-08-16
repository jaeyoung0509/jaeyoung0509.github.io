# Svelte 5 완벽 가이드: Svelte 3/4에서 바뀐 핵심 문법과 Runes 심층 분석

Svelte 3/4를 사용하시다가 Svelte 5를 접하면 가장 크게 혼란스러운 부분이 **"반응성을 다루는 룬(Runes)"** 과 **"이벤트 전달(Emit) 방식"** 입니다.

이 문서는 Svelte 3/4와 Svelte 5의 핵심 차이점을 1:1로 비교하고, 실제 개발에 바로 적용할 수 있는 구체적인 패턴을 정리한 종합 가이드입니다.

---

## 1. Svelte 5가 등장한 배경 (Why Runes?)

### Svelte 3/4의 한계점
1. **`.svelte` 파일 밖에서 반응성 사용 불가**: 별도의 `.js`/`.ts` 파일에서는 Svelte 특유의 반응형 변수를 쓸 수 없어서 `writable`, `readable` 같은 Store 라이브러리에 의존해야 했습니다.
2. **`$:` 문법의 모호함**: `$:` 하나로 `computed(계산값)`도 만들고, `watch/effect(부수효과)`도 처리하다 보니 실행 순서가 꼬이거나 불필요한 재계산이 발생했습니다.
3. **`export let`의 어색함**: JavaScript 표준에서 `export`는 내보내기인데, Svelte에서는 부모로부터 값을 받는 `Props`로 사용되어 의미가 충돌했습니다.
4. **`createEventDispatcher`의 한계**: TypeScript 환경에서 이벤트 페이로드의 타입을 엄격하게 추적하기 어려웠습니다.

### Svelte 5의 해결책: **Runes (룬)**
- Runes는 컴파일러에게 반응성 힌트를 주는 **`$`로 시작하는 특수 함수들**입니다.
- `.svelte` 컴포넌트 내부뿐만 아니라 **일반 `.svelte.ts` 파일에서도 똑같이 동작**하여 상태 관리 코드를 완벽하게 모듈화할 수 있습니다.

---

## 2. 핵심 문법 1:1 비교표

| 역할 | Svelte 3/4 (레거시) | Svelte 5 (현대적 방식) |
| :--- | :--- | :--- |
| **상태 정의** | `let count = 0;` | `let count = $state(0);` |
| **파생값 (Computed)** | `$: doubled = count * 2;` | `const doubled = $derived(count * 2);` |
| **복잡한 파생값** | `$: summary = calculate(a, b);` | `const summary = $derived.by(() => { ... });` |
| **부수 효과 (Side Effect)** | `$: { console.log(count); }` | `$effect(() => { console.log(count); });` |
| **Props 수신** | `export let title = "기본값";` | `let { title = "기본값" } = $props();` |
| **이벤트 발신 (Emit)** | `dispatch('change', value);` | **Callback Props (`let { onChange } = $props()`)** |
| **양방향 바인딩 Props** | `export let value;` (암묵적) | `let { value = $bindable() } = $props();` (명시적) |
| **DOM 이벤트 바인딩** | `<button on:click={fn}>` | `<button onclick={fn}>` (HTML 표준 속성) |
| **슬롯 / 템플릿 주입** | `<slot name="header" />` | `{#snippet header()}...{/snippet}` & `{@render header()}` |

---

## 3. 이벤트 전달 (Emit): `createEventDispatcher` vs `Callback Props`

Svelte 3/4의 `createEventDispatcher`는 Svelte 5에서 완전히 **Callback Props**로 대체되었습니다.

### ❌ Svelte 3/4 레거시 방식 (비권장)
```svelte
<!-- 자식 컴포넌트 Child.svelte (Svelte 3/4) -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('submitData', { id: 10, text: '안녕하세요' });
  }
</script>
<button on:click={handleClick}>전송</button>

<!-- 부모 컴포넌트 (Svelte 3/4) -->
<Child on:submitData={(e) => console.log(e.detail.id, e.detail.text)} />
```

### ⭕ Svelte 5 정석 방식 (100% 타입 안전)
자식 컴포넌트는 함수를 `$props`로 받고, 원하는 시점에 호출합니다.

```svelte
<!-- 자식 컴포넌트 Child.svelte (Svelte 5) -->
<script lang="ts">
  // 1. 부모가 넘겨줄 콜백 함수 시그니처를 TypeScript로 정확하게 명시
  let { 
    onSubmitData,
    onCancel 
  }: { 
    onSubmitData: (payload: { id: number; text: string }) => void;
    onCancel?: () => void;
  } = $props();

  function handleClick() {
    // 2. 그냥 함수를 호출하면 부모에게 데이터가 즉시 전달됨!
    onSubmitData({ id: 10, text: '안녕하세요' });
  }
</script>

<button onclick={handleClick}>전송</button>
<button onclick={() => onCancel?.()}>취소</button>
```

```svelte
<!-- 부모 컴포넌트 Parent.svelte (Svelte 5) -->
<script lang="ts">
  import Child from './Child.svelte';

  function handleReceive(payload: { id: number; text: string }) {
    console.log("자식이 보낸 ID:", payload.id);
    console.log("자식이 보낸 텍스트:", payload.text);
  }
</script>

<!-- 부모는 일반 속성 넘기듯이 연결 (on: 대신 일반 prop) -->
<Child 
  onSubmitData={handleReceive}
  onCancel={() => console.log("취소됨")}
/>
```

---

## 4. 반응형 상태 심층 분석 (`$state`, `$derived`)

### 1) `$state()`의 깊은 반응성 (Deep Reactivity)
Svelte 5의 `$state()`는 객체와 배열 내부의 속성 변경(Mutation)도 자동으로 감지합니다.

```svelte
<script lang="ts">
  let user = $state({
    name: "재영",
    tags: ["Go", "AWS"],
    profile: { age: 30 }
  });

  function update() {
    // Svelte 3처럼 user = user; 재할당할 필요 없이 바로 수정 가능!
    user.name = "이재영";
    user.tags.push("Svelte5");
    user.profile.age += 1;
  }
</script>

<p>{user.name} ({user.profile.age}세)</p>
<p>태그: {user.tags.join(", ")}</p>
<button onclick={update}>정보 업데이트</button>
```

> **💡 대용량 불변 객체 최적화 (`$state.raw`)**:  
> 변경을 감지할 필요가 없는 거대한 데이터셋이나 서드파티 라이브러리 인스턴스는 `let data = $state.raw(hugeArray);` 로 선언하면 오버헤드를 제로로 만들 수 있습니다.

---

### 2) `$derived` vs `$derived.by`
- **`$derived(단일 표현식)`**: 단순 수식이나 필터링
- **`$derived.by(함수)`**: 여러 줄의 로직, 조건문, 루프가 포함된 복잡한 계산

```svelte
<script lang="ts">
  let items = $state([
    { name: "사과", price: 1000, count: 2 },
    { name: "바나나", price: 1500, count: 3 }
  ]);

  // 1. 단순 파생값
  const itemCount = $derived(items.length);

  // 2. 복잡한 계산 로직을 가진 파생값 ($derived.by)
  const totalPrice = $derived.by(() => {
    let total = 0;
    for (const item of items) {
      total += item.price * item.count;
    }
    return total;
  });
</script>
```

---

## 5. 부수 효과 심층 분석 (`$effect`)

### 1) 자동 의존성 감지와 브라우저 전용 실행
`$effect`는 내부에서 접근한 `$state`, `$derived`, `$props`를 자동으로 감시합니다.

```svelte
<script lang="ts">
  let search = $state("");
  let page = $state(1);

  // search 또는 page가 바뀔 때마다 실행됨
  $effect(() => {
    console.log(`페이지 변경: ${page}, 검색어: ${search}`);

    // 서버 사이드 렌더링(SSR) 중에는 실행되지 않으므로 window/document 접근 안전!
    localStorage.setItem("saved_search", search);
  });
</script>
```

### 2) Cleanup(정리) 함수 패턴
이벤트 리스너, `setInterval`, 비동기 요청 취소(`AbortController`)는 return 함수로 정리합니다.

```svelte
<script lang="ts">
  let query = $state("");

  $effect(() => {
    if (!query) return;

    const controller = new AbortController();
    
    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => console.log("결과:", data));

    // 사용자가 다음 글자를 입력하여 effect가 재실행되거나, 컴포넌트가 언마운트될 때 실행
    return () => {
      controller.abort(); // 이전 API 요청 취소
    };
  });
</script>
```

---

## 6. 양방향 바인딩: `$bindable()`

부모와 자식 간에 `bind:value` 같은 양방향 바인딩을 허용하려면 자식에서 `$bindable()`을 명시해야 합니다.

```svelte
<!-- CustomInput.svelte -->
<script lang="ts">
  // 부모가 bind:value로 바인딩할 수 있도록 $bindable 설정
  let { value = $bindable("") }: { value?: string } = $props();
</script>

<input bind:value={value} />
```

```svelte
<!-- Parent.svelte -->
<script lang="ts">
  import CustomInput from './CustomInput.svelte';
  let text = $state("초기값");
</script>

<!-- 부모와 자식 간 양방향 동기화 -->
<CustomInput bind:value={text} />
<p>부모의 text: {text}</p>
```

---

## 7. 템플릿 컴포지션: `<slot />` ➔ `Snippet` (`{#snippet}` & `{@render}`)

Svelte 3/4의 `<slot>`은 다중 슬롯이나 자식에게 매개변수를 넘길 때 문법이 복잡했습니다. Svelte 5에서는 함수처럼 다룰 수 있는 **Snippet**이 도입되었습니다.

```svelte
<!-- 자식 컴포넌트: ListCard.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    items, 
    renderItem, 
    header 
  }: { 
    items: string[];
    renderItem: Snippet<[string, number]>; // 매개변수를 받는 스니펫
    header?: Snippet;                     // 일반 스니펫
  } = $props();
</script>

<div class="card">
  {#if header}
    <div class="header">
      {@render header()}
    </div>
  {/if}

  <ul>
    {#each items as item, index}
      <li>
        <!-- 스니펫 호출 및 데이터 전달 -->
        {@render renderItem(item, index)}
      </li>
    {/each}
  </ul>
</div>
```

```svelte
<!-- 부모 컴포넌트: Parent.svelte -->
<script lang="ts">
  import ListCard from './ListCard.svelte';
  const fruits = ["사과", "바나나", "체리"];
</script>

<ListCard items={fruits}>
  {#snippet header()}
    <h2>🍎 과일 목록</h2>
  {/snippet}

  {#snippet renderItem(fruit, idx)}
    <span class="badge">{idx + 1}</span>
    <strong>{fruit}</strong>
  {/snippet}
</ListCard>
```

---

## 8. 외부 파일에서 전역 상태 공유 (`.svelte.ts`)

Svelte 3/4에서는 `svelte/store`의 `writable()`을 써야 했지만, Svelte 5에서는 **일반 `.svelte.ts` 파일에서 `$state`를 선언하고 export**하기만 하면 전역 스토어가 완성됩니다.

```typescript
// src/lib/counter.svelte.ts
export class Counter {
  count = $state(0);
  doubled = $derived(this.count * 2);

  increment() {
    this.count++;
  }
}

// 전역 싱글톤 인스턴스 생성
export const globalCounter = new Counter();
```

```svelte
<!-- 어떤 컴포넌트든 바로 가져와서 사용 -->
<script lang="ts">
  import { globalCounter } from '$lib/counter.svelte';
</script>

<button onclick={() => globalCounter.increment()}>
  클릭 수: {globalCounter.count} (2배: {globalCounter.doubled})
</button>
```

---

## 9. 한눈에 보는 요약 팁

1. **상태를 만들 때는?** ➔ `let x = $state(초기값)`
2. **상태로 다른 값을 계산할 때는?** ➔ `const y = $derived(x * 2)`
3. **부모에게 Props를 받을 때는?** ➔ `let { name, age } = $props()`
4. **부모에게 이벤트를 보낼(Emit) 때는?** ➔ `let { onSave } = $props()` 받고 `onSave(데이터)` 호출
5. **DOM 조작, 리스너 등록, 외부 API 동기화는?** ➔ `$effect(() => { ... return cleanup; })`
6. **부모-자식 양방향 바인딩은?** ➔ `let { value = $bindable() } = $props()`
7. **레이아웃/슬롯 컴포지션은?** ➔ `{#snippet}` 과 `{@render}`
