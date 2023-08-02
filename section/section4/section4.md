# TypeScript & Modern JavaScript

## 1. var vs let vs const

## 2. 화살표 함수

## 3. 함수 매개변수 기본값

## 4. 전개 연산자

## 5. 나머지 매개변수

- 몇개의 인수가 들어올지 모를 때

  ```js
  // 전개 연산자 활용한 나머지 매개변수
  const add = (...numbers) => {
    return numbers.reduce((acc, cur) => acc + cur, 0);
  };

  add(3, 5, 7, 10, 20);
  ```

- 필요한 인자의 개수를 알고 있을 경우 튜플을 활용한 타입 지정이 가능

  ```ts
  // 각각 타입 지정
  const add = (a: number, b: number, c: number): number => a + b + c;

  // 튜플 활용
  const add = (...numbers: [number, number, number]) =>
    numbers.reduce((acc, cur) => acc + cur, 0);
  ```

## 6. 배열 및 객체 비구조화 할당

- 비구조화 할당 시 나머지 매개변수 활용 가능

  ```js
  const hobbies = ['Sports', 'Cooking'];

  // 나머지 값이 있다면 restHobbies에 전부 할당됨
  const [hobby1, ...restHobbies] = hobbies;
  console.log(resetHobbies); // 'Cooking'
  ```

- 객체 비구조화 할당 시 키 값과 변수명이 같아야 하는데 새 변수명으로 설정이 가능하다.

  ```js
  const person = {
    name: 'Kim',
    age: 29,
  };

  // 일반적인 방법
  const { name, age } = person;

  // 원하는 변수명으로
  // person.name 값이 lastName에 할당됨
  const { name: lastName, age } = person;
  ```

## 7. 코드 컴파일 및 마무리

- `tsconfig.json` 파일의 컴파일 옵션 target을 주의하자
