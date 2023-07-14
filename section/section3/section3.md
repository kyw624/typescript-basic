# 3. TypeScript 컴파일러 및 구성

## 1) 실시간 컴파일

변경 사항이 있을 때마다 자동으로 컴파일.

- 단일 파일  
  `tsc <파일명> --watch` or `tsc <파일명> -w`

- 프로젝트 전체 관리

  1. `tsc --init`: tsconfig.json 생성
  2. `tsc`: 프로젝트 내 모든 ts 파일 컴파일
  3. `tsc --watch(-w)` 입력 시 모든 ts 파일에 적용됨.

<br>

## 2) 파일 포함 및 제외하기

- `include`, `exclude` 모두 설정하면 `exclude`로 제외한 상태로 `include` 목록 컴파일

### 1. exclude

기본적으로 exclude 옵션을 아예 지정하지 않으면 자동으로 `node_modules`는 제외된다.

> 했다면 따로 설정해줘야함!

- 와일드카드
  - `*`: 0개 이상의 문자와 매칭 (디렉터리 구분 기호 제외)
  - `?`: 1개의 문자와 매칭 (디렉터리 구분 기호 제외)
  - `**/`: 반복적으로 모든 하위 디렉터리와 매칭

```json
// tsconfig.json
{
  "exclude": [
    "node_modules",
    "파일명.ts",
    "*.dev.ts", // dev.ts 포함된 모든 파일
    "**/*.dev.ts" // 모든 폴더에서 dev.ts 포함된 파일
  ]
}
```

### 2. include

- 경로 지정 (디렉터리)

```json
// tsconfig.json
{
  // 여기 있는 것만 컴파일됨.
  "include": ["src/**/*"]
}
```

### 3. files

- 개별 파일 지정
- 소규모 프로젝트에 적합

```json
// tsconfig.json
{
  "files": ["app.ts", "./utils/*.ts"]
}
```

<br>

## 3) 컴파일 대상 설정하기

### 1. compilerOptions

타입스크립트 코드가 컴파일되는 방식을 관리

#### - `"target"`: 컴파일 할 자바스크립트 버전 설정

ex) `"target": "es6"`

> es6 (= es2015)

```json
// tsconfig.json
{
  "target": "es6" // 자바스크립트 컴파일 버전 설정
}
```

#### - `"lib"`: 기본적으로 타입스크립트는 웹페이지에서만 사용되는 것이 아닌 node.js 애플리케이션에서 사용될 수도 있다.

하지만 DOM 조작 등 웹에서 필요한 기능이 필요할 때 활용되는 설정.

- 기능별 옵션은 공식문서에서 확인 가능

  > **lib 미설정 (= 기본 설정 적용)**  
  > 기본 설정: 자바스크립트 "target"에 따라 해당 스펙의 기능들이 결정된다.

ex)

```ts
// app.ts
const button = document.querySelector('button');

button.addEventListner(); // 리스너달면 에러 발생

// 1. 임시 해결 - 버튼 뒤에 ! 붙여주기
const button = document.querySelector('button')!; // 버튼이 존재한다는 의미
```

```json
// tsconfig.json
{
  "lib": ["dom", "es6", "DOM.Iterable", "ScriptHost"] // es6 기본 설정과 같다.
}
```

#### - `"allowJs"`: js 파일들 ts에서 import해서 쓸 수 있는지 (true/false)

#### - `"checkJs`: 일반 js 파일에서도 에러체크 여부 (true/false)

#### - `"jsx"`: tsx 파일을 jsx로 어떻게 컴파일할 것인지

- `"preserve"`
- `"react-native"`
- `"react"`

#### - `"sourceMap"`

- `true`로 설정 후 컴파일하면 파일마다 .js.map 파일이 함께 생성되는데,  
  브라우저의 soruce 탭에서 ts 파일도 확인할 수 있게해준다.

> ts 파일에 breakpoint 걸고 디버깅도 가능

#### - `"outDir"`: 컴파일된 js 파일의 아웃풋 경로 설정

```json
{
  "outDir": "./dist" // 컴파일된 js 파일의 아웃풋 경로 설정
}
```

#### - `"rootDir"`: 루트경로 바꾸기 (`"outDir"`)

- js 파일 아웃풋 경로에 영향줌.

```json
{
  "rootDir": "./src"
}
```

#### - `"removeComments"`: 컴파일할 때 주석 제거 여부

#### - `"noEmitOnError`: 에러있는 ts 파일의 컴파일 여부

- 값: true / false (기본값: false)

<br>

### 2. strict: 엄격한 체크 여부

- 값: true / false
- 하위 설정값들 전부 따라 적용됨

#### - `"noImplicitAny"`: 타입스크립트가 추론할 수 없는 값에 대해 엄격한 타입 에러 체크 여부

- 값: true / false

#### - `"strictNullCheck"`: null일 수 있는 값에 대한 엄격한 에러 체크 여부

- 값: true / false
- 다른 방법: 느낌표 연산자 사용
  > 끝에 ! 붙이면 null이 아닌 값을 반환한다고 알려준다는걸 의미함.

#### - `"strictBindCallApply"`: bind(), call(), apply()에 대한 엄격한 에러 체크 여부

<br>

### 3. 코드 품질 향상 관련 옵션

#### - `"noUnusedParameters"`: 함수 내에서 선언된 사용되지 않는 변수를 알려주는 옵션

- 전역변수는 잠재적으로 쓰일 수 있기때문에 체크하지 않음.

#### - `"noImplicitReturns"`: 때로는 반환하고, 때로는 안하는 함수가 있는지 알려주는 옵션
