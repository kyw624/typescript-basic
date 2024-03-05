# 7. 제네릭

### 1. 제네릭이란?

### 2. 제네릭 함수 & 클래스

### 3. 제네릭의 제약사항

### 4. 특별한 타입스크립트 타입들

---

<br>

## 1. 제네릭이란?

배열 타입을 정의하는 한 가지 방법으로,
다른 타입과 연결되어 함께 사용하는 타입.  
그 다른 타입이 무엇인지에 대해 아주 유연한 편.

> ex) 배열에 어떤 데이터가 저장되는지, 프로미스가 어떤 값을 반환하는지 등

### 선언

```ts
const names: Array<string> = []; // string[]와 같다.
```

### Promise 타입

제네릭을 활용한 프로미스 타입 지정

```ts
// 1. any 타입
const promise: Promise<number> = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(10);
    // resolve(true);
    resolve('abc');
  }, 2000);
});

promise.then((data) => {
  data.split('');
});

// 2. number 타입
const promise: Promise<number> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(10);
  }, 2000);
});

// number 타입을 명시해놨으므로 split에서 에러 발생
promise.then((data) => {
  data.split(''); // Error
});

// 3. string 타입
const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('abc');
  }, 2000);
});

// string이므로 정상 작동
promise.then((data) => {
  data.split('');
});
```

<br>

## 2. 제네릭 함수 & 클래스

### 제네릭 함수

객체 2개를 받아 하나의 객체로 합쳐주는 함수 예시

```ts
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Kim' }, { age: 29 });
mergedObj.age; // 에러 발생
```

age가 존재하지만 타입스크립트가 모르기때문에 접근할 수 없다.

#### 1. 타입 캐스팅 활용

해결할 수 있지만 번거롭다.

```ts
const mergedObj = merge({ name: 'Kim' }, { age: 29 }) as {
  name: string;
  age: number;
};
console.log(mergedObj.age); // 정상 작동
```

#### 2. 제네릭 활용

보통 `Type`을 나타내는 `T`를 넣지만, 다른 식별자를 써도 된다.  
두번째 타입으로는 보통 `U`를 넣는다.

**`T extends {}`**  
`extends` 해주지 않으면 에러가 발생한다.  
`objB`의 값이 객체가 아니면 `Object.assign`이 실패하고, `objA`를 반환하기때문에  
제약을 걸어 항상 객체를 반환함을 보장해준다.

```ts
function merge<T extends {}, U>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Kim' }, { age: 29 });
console.log(mergedObj.age); // 정상 작동
```

**`구체적인 타입 지정`**  
아래처럼 `T`, `U`에 구체적인 타입을 지정해줄 수도 있지만,  
타입스크립트가 알아서 추론해 연결해주므로 필요없다.

```ts
const mergedObj = merge<{ name: string; hobbies: string[] }, { age: number }>(
  { name: 'Kim', hobbies: ['game', 'sports'] },
  { age: 29 }
);
```

### 타입을 구체적으로 명시한 제네릭 함수

다루는 데이터가 문자열이든 배열이든 상관없지만, `length` 속성을 가져야 함.

```ts
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.';

  if (element.length === 1) {
    descriptionText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptionText = `Got ${element.length} elements.`;
  }

  return [element, descriptionText];
}
```

#### 1) 문자열 전달

```ts
countAndDescribe('Hi there!'); // ['Hi there!', 'Got 9 elements.']
```

#### 2) 배열 전달

```ts
countAndDescribe(['Sports', 'Cooking']); // [Array(2), 'Got 2 elements.']

countAndDescribe([]); // [Array(0), 'Got no value.']
```

#### 3) 숫자 전달

숫자에는 length 속성이 없으므로 에러 발생.

```ts
countAndDescribe(10); // Error
```

#### 4) 객체 타입 검사

```ts
// 에러
function extractAndConvert(obj: object, key: string) {
  return 'Value: ' + obj[key];
}

console.log(extractAndConvert({ name: '' }, 'name'));
```

`obj`에 `key`가 있는지 확실히 보장하지 못하므로 에러가 발생하는데,  
`keyof`와 제네릭으로 해결할 수 있다.

```ts
// 제네릭을 사용해 수정
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return 'Value: ' + obj[key];
}

console.log(extractAndConvert({ name: '' }, 'name'));
```

### 제네릭 클래스

클래스에도 제네릭을 적용시켜,  
유연하면서도 명확한 타입 지정이 가능하다.

> 특정 메서드에만 제네릭 타입이 필요한 경우 해당 메서드에만 지정하는 것도 가능하다.

```ts
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
const numberStorage = new DataStorage<number>();
const objStorage = new DataStorage<object>();
```

> ❗객체를 다룰 때 주의사항

- `object`는 원시값이 아닌 참조형이기 때문에 위의 형식으로는 `removeItem`이 정상적으로 작동하지 않는다.

  ```ts
  removeItem(item: object) {
    // 전달되는 객체는 새로운 객체로 받아들인다.
    // item이 이전 item과 달라 -1을 반환하므로 마지막 요소를 제거하게 된다.
    this.data.splice(this.data.indexOf(item), 1);
  }

  const objStorage = new DataStorage<object>();

  objStorage.addItem({ name: 'Kim' });
  objStorage.addItem({ name: 'Son' });
  objStorage.removeItem({ name: 'Kim' });
  ```

- 이 문제를 해결 할 방법은 예외 처리와 함께 객체 값을 변수에 지정한 뒤 사용하는 것이다.

  ```ts
  removeItem(item: object) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  const kimObj = { name: 'Kim' };

  objStorage.addItem(kimObj);
  objStorage.addItem({ name: 'Son' });
  // 같은 값을 가리켜 정상적으로 제거된다.
  objStorage.removeItem(kimObj);
  ```

- 더 나은 방법으로는 타입을 원시값으로만 작동하도록하는 것이다.

  ```ts
  class DataStorage<T extends string | number | boolean> {
    // ...
  }
  ```

<br>

## 3. 제네릭의 제약사항

제네릭 타입에 원하는 제약 조건을 걸어 불필요한 오류나 예기치 않은 작동을 피할 수 있다.

조건을 걸려는 타입 뒤에 `extends` 키워드와 함께 타입을 지정하면 된다.

```ts
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}
```

<br>

## 4. 특별한 타입스크립트 타입들

### 유틸리티 타입

- 타입 스크립트에서만 있는 많은 유틸리티 타입이 있다.

- 유틸리티 타입은 모두 제네릭이다.

자주 사용되는 몇 개의 타입을 알아보자.

#### 1. Partial 타입

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}
```

- 빈 객체로 인한 에러 발생

  ```ts
  // 1. 에러 발생
  function createCourseGoal(
    title: string,
    description: string,
    date: Date
  ): CourseGoal {
    let courseGoal: CourseGoal = {}; // 빈 객체 에러

    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = date;

    return courseGoal;
  }
  ```

- Partial 타입으로 감싸면 위에서 작성했던 `CourseGoal`이 아래와 같이 모든 속성이 옵셔널 속성이 된다.

  따라서 빈 객체로 두어도 요소들을 차례로 추가할 수 있다.

  ```ts
  interface CourseGoal {
    title?: string;
    description?: string;
    completeUntil?: Date;
  }

  // 2. Partial 타입 적용
  function createCourseGoal(
    title: string,
    description: string,
    date: Date
  ): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {}; // Partial 타입 적용

    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = date;

    return courseGoal as CourseGoal;
  }
  ```

#### 2. Readonly 타입

특정값을 추가, 삭제할 수 없이 고정되도록 하고싶은 경우 유용하다.

```ts
const naems = ['Max', 'Anna'];
names.push('Manu');
```

- Readonly 타입 적용

  ```ts
  const names: Readonly<string[]> = ['Max', 'Anna'];
  names.push('Manu'); // 읽기 전용 값으로 에러 발생
  ```

#### 3. Omit 타입

특정 타입에서 지정된 속성만 제거한 타입을 정의해준다.

```ts
interface AddressBook {
  name: string;
  phone: number;
  address: string;
  company: string;
}

const phoneBook: Omit<AddressBook, 'address'> = {
  name: '재택근무',
  phone: 12342223333,
  company: '내 방',
};

const chingtao: Omit<AddressBook, 'address' | 'company'> = {
  name: '중국집',
  phone: 44455557777,
};
```

#### 4. Pick 타입

특정 타입에서 몇 개의 속성을 선택하여 타입을 정의해준다.

```ts
interface Hero {
  name: string;
  skill: string;
}

const human: Pick<Hero, 'name'> = {
  name: '스킬이 없는 사람',
};
```

<br>
