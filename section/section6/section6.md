# 6. 고급 타입

### 1. 교차 타입 (Intersection Types)

### 2. 타입 가드 (Type Guards)

### 3. 구별된 유니온 (Discriminated Unions)

### 4. 타입 캐스팅 (Type Casting)

### 5. 함수 오버로딩 (Function Overloads)

---

<br>

## 1. 교차 타입 (Intersection Types)

여러 개의 타입을 동시에 만족해야하는 타입

```ts
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Kim',
  privileges: ['create-server'],
  startDate: new Date(),
};
```

인터페이스와 상속으로도 가능

```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

interface ElevatedEmployee extends Employee, Admin {}

const e1: ElevatedEmployee = {
  name: 'Kim',
  privileges: ['create-server'],
  startDate: new Date(),
};
```

그러나 교차 타입이 유용한 점이 있는데, 꼭 객체 타입이 아니어도 된다.

```ts
type Combinable = string | number;
type Numeric = number | boolean;

// 공통된 number를  Universal의 타입으로 판단
type Universal = Combinable & Numeric;
```

즉, 객체 타입끼리의 교차 결과는 각 객체의 속성을 모두 조합한 것이고,  
유니온 타입끼리의 교차 결과는 공통된 타입이다.

<br>

## 2. 타입 가드 (Type Guards)

유니온 타입을 쓸 때 도움이 되는데,  
여러 타입을 다루는 유니온 타입의 유연성의 이점을 살리면서 런타임에 코드가 제대로 실행되게 해준다.

```ts
type Combinable = string | number;
```

```ts
// 컴파일 에러
function add(a: Combinable, b: Combinable) {
  return a + b; // 에러
}
```

```ts
// typeof를 활용해 정상 작동
function add(a: Combinable, b: Combinable) {
  // 타입 가드
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }

  return a + b;
}
```

### in 키워드를 활용한 타입 가드

그러나 `typeof`는 자바스크립트가 아는 타입인 `string`, `number`, `boolean`, `object` 등만 검사가 가능하기 때문에 커스텀 타입은 검사할 수 없는데 `in` 키워드를 활용할 수 있다.

```ts
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type UnknownEmployee = Employee | Admin;
```

```ts
// 컴파일 에러
function printEmployeeInformation(emp: UnknownEmployee) {
  if (typeof emp === 'Employee') {
    // 에러
  }
}
```

```ts
// in 키워드를 활용해 정상 작동
function printEmployeeInformation(emp: UnknownEmployee) {
  // 타입 가드
  if ('privileges' in emp) {
    console.log('Privileges: ' + emp.privileges);
  }

  // 타입 가드
  if ('startDate' in emp) {
    console.log('Privileges: ' + emp.startDate);
  }
}
```

### instanceof를 활용한 타입 가드

클래스에서 타입 가드를 작성할 때도 `in` 키워드를 활용할 수 있지만 문자열 오타를 낼 수 있기때문에 조금 더 나은 방법으로 `instanceof` 를 사용할 수 있다.

```ts
class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo ...' + amount);
  }
}

type Vehicle = Car | Truck;
```

```ts
// in 키워드 활용
function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  // 오타 날 수 있음
  if ('loadCargo' in vehicle) {
    vehicle.loadCargo(1000);
  }
}
```

```ts
// instanceof 활용
function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}
```

<br>

## 3. 구별된 유니온 (Discriminated Unions)

인터페이스로 정의해서 `instanceof`를 사용할 수 없을 경우 구별된 유니온으로 만들어 해결할 수 있다.

### instanceof 예시 (에러 발생)

```ts
interface Bird {
  flyingSpeed: number;
}

interface Horse {
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  // 에러 발생
  if (animal instanceof Bird) {
    console.log('Moving with speed: ' + animal.flyingSpeed);
    return;
  }

  console.log('Moving with speed: ' + animal.runningSpeed);
}
```

### 임의의 리터럴 타입의 필드를 정의해 타입 가드로 활용

프로퍼티명에 일반적으로 `type` 또는 `kind`를 사용한다.

```ts
interface Bird {
  type: 'bird'; // <--
  flyingSpeed: number;
}

interface Horse {
  type: 'horse'; // <--
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;

  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;

    case 'horse':
      speed = animal.runningSpeed;
      break;
  }

  console.log('Moving with speed: ' + speed);
}

moveAnimal({ type: 'bird', runningSpeed: 10 }); // 에러 발생
moveAnimal({ type: 'bird', flyingSpeed: 10 }); // 정상 작동
```

<br>

## 4. 형 변환 (Type Casting)

기본적으로 HTML 요소들도 타입스크립트가 파악한다.

```html
<body>
  <input id="user-input" />
</body>
```

```ts
const userInputElement = document.getElementById('user-input'); // type: HTMLElement || null
```

그러나 값을 설정하려하면 `null`일 수 있기때문에 에러가 발생해 강제로 타입을 지정해줘야 한다.

- `!`: 단언 연산자로, 피연산자가 절대 null이 아니라고 전달한다.
  > 절대 null이 반환되지 않는다면 사용하고, 모르겠다면 if문을 활용
- `<HTMLInputElement>`: HTML Input 요소라는 타입을 정보를 전달한다.
  - 앞에 사용하거나 리액트 jsx와의 혼동을 줄이기위해 뒤에 `as`와 함께 사용할 수 있다.
  - 둘 다 같으니 프로젝트 내에서 일관되게 사용할 것.

```ts
userInputElement.value = 'Hi there!'; // 에러 발생

const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')!
);
const userInputElement = document.getElementById(
  'user-input'
)! as HTMLInputElement;
```

if문을 사용한다면 형 변환을 아래와 같이 해줘야 한다.  
위처럼 선언시 해버리면 null이 아닐거라는걸 알려주는 것과 같기때문.

```ts
const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')
);

if (userInputElement) {
  (userInputElement as HTMLInputElement).value = 'Hi there!';
}
```

### 인덱스 타입

객체를 생성할 때 객체의 속성과 관련해 보다 유연한 객체를 만들 때 사용된다.

**예시) 에러 컨테이너**  
현재는 email, username의 에러를 전달하기 위함이지만,  
필드가 늘어나는 등의 이유로 제한하고 싶지 않을 때 사용해 유연하게 작성 가능.

1. 괄호([]) 안에 프로퍼티명과 타입을 지정
   > `[key: string]` or `[prop: string]`
2. 값의 타입 지정
   > `[key: string]: string` or `[prop: string]: string`

```ts
interface ErrorContainer {
  id: string;
  [prop: string]: string; // 어떤 프로퍼티가 오던지 문자열이고, 그 값도 문자열이다.
}
```

그러나 제약이 한가지 있다.  
인덱스 타입이 아닌 다른 속성을 추가로 정의하려면, 인덱스 타입과 동일한 타입만이 올 수 있다.

```ts
interface ErrorContainer {
  id: number; // 에러 발생. 인덱스 타입과 같은 string만 가능하다.
  [prop: string]: string;
}
```

<br>

## 5. 함수 오버로딩 (Function Overloads)

한 함수를 다양한 방식으로 호출하는 것을 의미한다.

아래의 `add` 함수를 예로 들면,  
a, b가 모두 숫자일 때는 숫자를, 문자열일 때는 문자열을,  
둘 중 하나라도 문자열이라면 문자열을 반환한다.

```ts
type Combinable = string | number;

function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }

  return a + b;
}
```

타입스크립트는 해당 함수를 사용해 반환받은 값의 타입을 확실하게 추론하지 못한다.

> `result: string || number`

```ts
const result = add(1, 2);
```

함수 오버로딩을 사용하면 이런 경우에도 명확하게 명시할 수 있다.

> 오버로딩 할 함수의 위에 작성

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): number;
function add(a: number, b: string): number;
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }

  return a + b;
}

add(1, 2); // number
add('A', 'B'); // string
add('A', 2); // string
add(2, 'A'); // string
```

### 옵셔널 체이닝

어떤 값이 있는지 확인하고 있는 경우에만 뒤의 값에 접근하도록 하는 기법.

확실하지 않은 값 뒤에 `?`를 붙여 사용한다.

```ts
const fetchedUserDate = {
  id: 'u1',
  name: 'Kim',
  job: { title: 'CEO', description: 'My own company' },
};

console.log(fetchedUserDate?.job?.title);
```

### Null 병합 연산자

API 등을 통해 가져온 어떤 데이터가

OR 연산자를 활용해 특정값을 지정할 수 있다.  
단점으로 `''` 빈 문자열의 경우에도 `false`로 판단하게 된다.

```ts
const userInput = null;
const storedData = userInput || 'DEFAULT'; // 'DEFAULT'

const userInput = '';
const storedData = userInput || 'DEFAULT'; // 'DEFAULT'
```

하지만 `null` 또는 `undefined` 만을 처리하기 위해서라면  
null 병합 연산자(`??`)를 사용해야한다.

```ts
const userInput = null;
const storedData = userInput ?? 'DEFAULT'; // 'DEFAULT'

const userInput = undefined;
const storedData = userInput ?? 'DEFAULT'; // 'DEFAULT'

const userInput = '';
const storedData = userInput ?? 'DEFAULT'; // ''
```
