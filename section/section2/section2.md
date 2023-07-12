# 2. TypeScript 기본 & 기본 타입

### 1) 타입스크립트 타입 vs 자바스크립트 typeof

- 자바스크립트는 런타임 중에 확인되고,  
  타입스크립트는 정적 타입을 지원해 컴파일 중에 확인되므로 더 빠른 에러 발견과 대응이 가능하다.

### 2) Core Type

- number: 정수, 실수 모든 숫자형 포함
- string: '' / "" / `` 3가지 방법으로 정의
- boolean: true / false
- object: 객체가 아닌 원시 타입이 아닌 타입을 나타냄.
  > number, string, boolean, bigint, symbol, null, undefined 가 아닌 나머지를 의미
- Array: `type[]` 또는 `Array<type>` 으로 정의
- Tuple: `[number, string]` 처럼 각 자리에 맞는 타입의 값만 올 수 있지만 예외적으로 지정한 타입값들의 push는 가능하다.
- Any: 모든 종류의 값을 저장할 수 있다. 그러나 **가능한 사용하지 않는 것이 좋다.** 타입스크립트의 장점이 없어지는 것과 마찬가지고, 타입스크립트 컴파일러도 작동하지 않는다.
- enum: 1씩 증가하거나 임의의 값들과 매핑된 식별자들을 관리하는데 용이하지만 필요에 따라 임의의 고유값들로 할당할 수 있다.

  ```ts
  // enum X
  // 각 변수별로 직접 관리해줘야 함.
  const ADMIN = 0;
  const READ_ONLY = 1;
  const AUTHOR = 2;

  // enum O
  // 값 미할당 시 0부터 1씩 자동으로 늘어남.
  // 값 할당 시 해당값부터 1씩 증가
  enum Role {
    ADMIN, // 0
    READ_ONLY, // 1
    AUTHOR, // 2
  }

  // 할당값부터 1씩 증가
  enum Role {
    ADMIN = 5,
    READ_ONLY, // 6
    AUTHOR, // 7
  }

  // 임의 고유값 할당
  enum Role {
    ADMIN = 'ADMIN',
    READ_ONLY = 100,
    AUTHOR = 200,
  }
  ```

### 3) 타입 할당 & 타입 추론

1. 함수와 변수에 모두 타입을 지정하지 말 것

   - 함수에만 지정해도 타입스크립트가 알아서 추론

2. let 으로 변수에 값 할당 시 해당 타입으로 알아서 추론함.

   - 다른 타입의 값 할당 시 에러

### 4) 객체 타입

1. 자바스크립트의 객체와는 다르다.

   - 임의의 객체 작성 후 마우스를 올려보면 프로퍼티 끝이 쉼표(,)가 아닌 세미콜론(;)으로 끝난다.

2. 타입스크립트에서 객체임을 알리려면 `object`가 아닌 `{}`를 타입으로 지정하고, 내부에 각 프로퍼티에 대한 타입을 작성한다.

3. 중첩 객체에 대해서도 타입 지정이 가능하다.

<br>

### 5) 유니온 타입 (Union Type)

- 용법: `<type> | <type>`
- 매개변수의 타입을 여러가지로 좀 더 유연하게 가져가고 타입에 따라 함수 내에 다른 로직을 적용할 수 있다.

```ts
function combine(input1: number | string, input2: number | string) {
  return input1 + input2;
}
```

<br>

### 6) 리터럴 타입

- 변수나 매개변수에 정확한 값을 설정해주는 것을 의미한다.

- 예시

  ```ts
  const hello = 'world'; // 절대 변하지 않음.

  // 매개변수로 'as-number', 'as-text' 2개의 값만 받을 수 있음.
  function combine(resultConversion: 'as-number' | 'as-text') {
    return;
  }

  // [ 숫자형 리터럴 타입 ]
  // 주로 설정값을 설명할 때 사용됨.
  /** loc/lat 좌표에 지도를 생성합니다. */
  declare function setupMap(config: MapConfig): void;

  interface MapConfig {
    lng: number;
    lat: number;
    tileSize: 8 | 16 | 32;
  }

  setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });

  /** 주사위 굴리기 */
  function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
    return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  }
  ```

<br>

### 7) Type Alias (사용자 정의 타입)

재사용 가능한 사용자 임의의 새로운 타입을 정의/관리할 수 있는 기능으로,  
**인터페이스와 유사**하지만 차이점이 있다.

- **인터페이스와 차이점**

  - **타입 앨리어스**는 원시값, 유니온 타입, 튜플 등도 지정이 가능하다.
  - **인터페이스**는 extends, implements 될 수 있다.
  - **결론:** 상속을 통해 확장이 필요하다면 인터페이스를, 인터페이스로 표현할 수 없거나 유니온 또는 튜플을 사용해야한다면 타입 앨리어스를 사용하는 편이 유리하다.

- 용법: `type 별칭 = <type> | <type> ...`;
- 예시

  ```ts
  // 기존 코드
  function combine(
    input1: number | string,
    input2: number | string,
    resultConversion: 'as-number' | 'as-text'
  );

  // type alias 활용
  type Combinable = number | string;
  type ConversionDescriptor = 'as-number' | 'as-text';

  function combine(
    input1: Combinable,
    input2: Combinable,
    resultConversion: ConversionDescriptor
  ) {}
  ```

<br>

### 8) 함수의 반환 타입 및 "무효"

함수의 반환값에도 타입 지정이 가능하다.

- void: 아무것도 반환하지 않음을 의미. 해당 함수의 반환값은 undefined.

  > - 함수가 undefined를 비롯해 아무것도 반환하지 않는다면 void를 사용.
  > - 함수에 의도적으로 반환문이 없다는 것을 의미.
  > - 반환값이 있다면 무시됨.

- undefined: 반환하는 실제 값이 없어야 함.

- `void` vs `undefined`

  ```ts
  // void는 return문이 필요없다.
  function printResult(num: number): void {
    console.log('Result: ' + num);
  }

  // undefined는 return문이 필요하다.
  function printError(num: number): undefined {
    console.log('Result: ' + num);
  } // 에러

  function printSuccess(num: number): undefined {
    console.log('Result: ' + num);
    return; // return문 추가
  } // 작동
  ```

<br>

### 9) 함수 타입

변수에 함수만 할당되도록 함수 타입도 지원하는데, 화살표 함수를 통해 매개변수 및 매개변수 타입 등 함수에 대한 구체적인 정의도 가능하다.

```ts
// 함수 타입만 지정
let fnExample: Function;

// 매개변수 a, b: number
// 반환값: number
let detailExample: (a: number, b: number) => number;
```

<br>

### 10) 함수 타입 및 콜백

함수 타입에서 콜백 함수에 대한 정의도 가능하다.

```ts
// 콜백함수의 타입 정의
function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

// addAndHandle의 콜백에 number 타입을 지정해줬기때문에 result는 number로 추론
addAndHandle(10, 20, (result) => {
  console.log(result); // 30
});
```

<br>

### 11) Unknown Type

- 어떤 사용자가 무엇을 입력할 지 알 수 없는 타입
- 에러 발생 없이 어떤 값이든 저장할 수 있다.
- any 타입과 다르게 작동함.

  > any보다 좀 더 제한적임.

- 값을 할당하려면 추가적인 타입 검사가 필요하다.

  ```ts
  let userInput: unknown;
  let userName: string;

  userInput = 'Max';

  // 타입검사 X
  userName = userInput; // 에러.
  // 별개로 userInput이 any타입이면 에러없음.

  // 타입검사 O
  if (typeof userInput === 'string') {
    userName = userInput; // 정상작동
  }
  ```

- **any vs unknown**
  - **any:** 어느 타입의 변수에도 할당 가능
  - **unknown**
    1. `any`와 같이 모든 타입을 넣을 수 있다.
    2. `any`와 `unknown` 타입을 제외한 변수에는 할당은 불가능
       > 추가적인 타입검사 필요
  - **결론**
    1. any보다는 unknown이 낫다.
       > **더 나은 이유**  
       > 어떤 타입일지 모를 때 타입 검사를 수행할 수 있기 때문.
    2. 어떤 값인지 명확히 안다면 유니온 타입을 쓰는게 좋다.

<br>

### 12) never 타입

- 함수의 반환 타입.

  > 변수 또한 타입가드에 의해 아무 타입도 얻지 못하면 never 타입을 얻게 될 수 있다.

- 항상 오류를 발생시키거나 절대 반환하지 않는 반환 타입으로 쓰인다.

- 반환값이 없지만 void와는 다르다.

- never를 반환하는데 반환값은 생성하지않는다.

- 반환 타입으로 never를 명시하지 않으면 타입스크립트는 void로 추론한다.

- **never 반환 예제**

  ```ts
  // never를 반환하는 함수는 함수의 마지막에 도달할 수 없다.
  function error(message: string): never {
    throw new Error(message);
  }

  // 반환 타입이 never로 추론된다.
  function fail() {
    return error('Something failed');
  }

  // never를 반환하는 함수는 함수의 마지막에 도달할 수 없다. (무한 루프)
  function infiniteLoop(): never {
    while (true) {}
  }
  ```
