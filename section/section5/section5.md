# 5. 클래스 & 인터페이스

## 1. 개요 (What? & Why?)

### 객체 지향 프로그래밍 (OOP)

- 현실 세계의 실제 개체들로 작업하는 방법론

- 더 추론하기 쉬운 코드

- 객체 간의 상호작용을 통한 프로그램 조직화

### 클래스

- 객체의 형태, 포함해야 하는 데이터, 기능들을 클래스를 통해 자세하게 정의

- 동일한 구조와 메서드를 포함한 여러 객체를 쉽게 만들 수 있게 해준다.

### 인스턴스

- 클래스 내부에 정의된 객체들을 의미

<br>

## 2. 클래스 & 상속 (Inheritance)

### private / public / readonly

- 클래스 필드에 지정할 수 있는 키워드로 타입스크립트에서 지원한다.

- 생성자 파라미터에 전달할 때 함께 지정할 수 있다.

  > 암묵적으로 클래스 프로퍼티로 선언되어 사전에 별도의 초기화가 필요없다.

  ```ts
  class Abc {
    constructor(private readonly id: string, public name: string) {}
  }
  ```

1. `private`: 외부에서의 접근을 막는다.

2. `public`: `private` 키워드의 반대로 외부에서 접근이 가능하다.  
   아무것도 명시하지 않으면 기본 `public`

3. `readonly`: 프로퍼티 초기화 후 수정이 불가능하다.

### 상속

- 공통된 필드, 메서드와 각 클래스별로 개별적인 필드, 메서드가 필요할 때 상속을 사용한다.

- super()를 먼저 호출해야함.

  ```ts
  class Department {
    private employees: string[] = [];

    constructor(private id: string, public name: string) {
      this.name = name;
    }

    addEmployee(name: string) {
      this.employees.push(name);
    }
  }

  class AccountingDepartment extends Department {
    constructor(id: string, private reports: string[]) {
      super(id, '회계'); // 부모 클래스의 생성자를 호출해 id, name 값을 전달
      this.reports = reports;
    }

    addReport(report: string) {
      this.reports.push(report);
    }
  }

  const obj = new Department('d1', '부서');
  console.log(obj); // { id: 'd1', name: '부서', employees: [] }

  // 상속
  const obj2 = new AccountingDepartment('d2', []);
  console.log(obj2); // {id: 'd2', name: '회계', employees: [], reports: []}
  ```

### 오버라이드

- 상위 클래스의 메서드를 상속받아 재정의할 수 있는데 이를 `오버라이드`라 한다.

- 상위 클래스에서 `private`로 선언한 프로퍼티는 상속받은 클래스에서는 사용할 수 없다.

- 외부에서의 접근을 막으면서 상속 클래스에게 액세스 권한을 부여하려면 대신 `protected` 키워드를 사용하면된다.

  ```ts
  class Super {
    protected employees: string[] = [];

    // ...

    addEmployees(name: string) {
      this.employees.push(name);
    }
  }

  class Sub extends Super {
    // ..

    addEmployees(name: string) {
      // 오버라이드
      if (name === 'over') {
        return;
      }

      this.employees.push(name);
    }
  }

  const sub = new Sub();

  sub.addEmployees('over'); // 추가되지 않음.
  sub.addEmployees('kim');
  console.log(sub.employees); // ['Kim']
  ```

### getter & setter

자바스크립트에서도 지원하는 기능으로, 주로 캡슐화에 사용된다.

#### `getter`

값을 가져오기 위해 함수나 메서드를 실행하는 프로퍼티

- 앞에 `get` 을 붙여 함수, 메서드처럼 작성한다.

- 예를 들어 `private` 프로퍼티의 수정과 같은 액세스를 막으면서 값은 가져오고 싶을 때 사용.

- 호출시 프로퍼티처럼 사용한다.  
  뒤에 소괄호 붙이지 않고 호출.

#### `setter`

`getter`와 유사하게 set 키워드를 사용해 정의하고, 원하는 이름을 붙인다.

> 일반적으로 설정하려는 프로퍼티의 이름과 관련지어 짓는다.

- 사용자가 전달하는 값을 매개변수로 받아야 하며, 값을 전달할 때 함수나 메서드처럼 괄호로 전달하는 것이 아닌 등호를 통해 전달한다.
  > class.setterFn = value;

```ts
class Super {
  private lastReport: string;

  // obj.mostRecentReport
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }

    throw new Error('No report found.');
  }

  // obj.mostRecentReport = value
  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('입력값 오류')
    }

    this.addReport(value);
  }

  constructor(private reports: string[]) {
    this.reports = reports;
    this.lastReport = this.reports[0];
  }

  addReport(report: string) {
    this.reports.push(report);
    this.lastReport = report;
  }
}

const super = new Super([]);

super.lastReport // 액세스 불가
super.mostRecentReport; // getter
super.mostRecentReport = 'Hello'; // setter
```

### 정적 프로퍼티 & 메서드

자바스크립트에서도 지원하는 기능으로,  
클래스에서 사용할 유틸리티 함수 정의나 클래스에 저장하는 전역 상수를 관리하는데 사용된다.

- `static` 키워드를 붙여 정의한다.

- 정적 메서드는 특정한 객체가 아닌 클래스 자체에 속한 함수를 구현하고자 할 때 주로 사용된다.

  > ex) 제곱해주는 Math.pow() 등..  
  > new Math()로 객체를 생성해 사용하는게 아닌 그냥 함수처럼 사용.

- 정적이지 않은 요소에서는 사용이 불가능.

  > ex) 생성자 등 static이 아닌 모든 메서드..

- 또 생성자는 정적으로 정의할 수 없다.

```ts
class Department {
  // 정적 프로퍼티
  static fisicalYear = 2020;
  // ...

  // 정적 메서드
  static createEmployee(name: string) {
    return { name: name };
  }
}

const employee1 = Department.createEmployee('Kim');

console.log(Department.fisicalYear); // 2020
console.log(employee1); // { name: 'Kim' }
```

### 추상 클래스

특정 메서드를 오버라이드하도록 강제하고 싶은 경우 사용된다.

- 공통으로 사용되는 메서드지만 상속받는 클래스마다 다르게 구현해야 할 때 사용한다.

- 단, 추상 클래스는 상속을 위한 클래스이며 인스턴스화 할 수 없다.

  > ex) new 추상클래스() - 불가능

- 기본 클래스에서 `abstract` 키워드를 사용해 빈 메서드를 정의한다.

- `abstract` 키워드는 추상 클래스에서만 사용할 수 있는데,  
  하나 이상의 `abstract` 메서드를 정의하려면 클래스 앞에서 붙여야한다.

```ts
abstract class Department {
  // ...

  // 추상 메서드의 선언
  abstract describe(): void;
}

class Sub extends Department {
  // ...

  // 구현이 필수
  describe() {
    // ...
  }
}
```

### 싱글톤 패턴 & private 생성자

싱글톤 패턴에서는 한 클래스의 인스턴스를 정확히 1개만 생성한다.

- 정적 메서드나 프로퍼티를 사용할 수 없거나 사용하고 싶지 않을 때 유용하다.

- 객체를 1개만 생성할 수 있도록 생성자 앞에 `private` 키워드를 붙인다.

```ts
class Myclass {
  private instance: Myclass;
  private constructor(private id: string, private name: string) {
    this.id = id;
    this.name = name;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new Myclass('A1', 'Kim');

    return this.instance;
  }
}

// 모든 프로퍼티가 동일한 인스턴스.
const singleObj = Myclass.getInstance();
const singleObj2 = Myclass.getInstance();
```

<br>

## 3. 인터페이스

### 개요

- 자바스크립트에서는 지원하지 않는다.

- 대문자로 시작하는 것이 관례이다.

- 블루프린트로 사용하는 클래스와 다르게 커스텀 타입처럼 사용한다.

- 주로 객체의 구조를 정의할 때 사용하지만 함수를 정의할 때도 사용할 수 있다.

- 프로퍼티, 메서드 등 구조를 정의할 수 있지만 값을 할당할 수 없다.

```ts
interface Person {
  name: string;
  age: number;
  greet(text: string): void;
}

let user1: Person; // 미리 구조 정의

user1 = {
  name: 'Kim',
  age: 29,
  greet(text: string) {
    console.log(text + ' ' + this.name);
  },
};

user1.greet('Hello, My name is'); // 'Hello, My name is Kim'
```

- `public`, `private` 키워드 사용 불가능

- `readonly` 키워드 사용 가능

  - 초기화 후 수정할 수 없다.
  - 클래스에 implements 하면 따로 설정하지 않아도 적용됨.

- 클래스처럼 상속이 가능하다.

- 클래스와 다르게 여러 인터페이스의 상속이 가능하다. (쉼표로 구분)

  ```ts
  interface Named {}

  interface Greetable {}

  interface Person extends Named, Greetable {}
  ```

### 왜 인터페이스를 사용하는가?

#### 1. 커스텀 타입으로 정의해도 되지 않을까?

- 객체의 구조를 정의할 때 **인터페이스**, **커스텀 타입** 모두 사용할 수 있고, 둘은 서로 비슷하지만 차이점이 있다.

- **커스텀 타입**이 유니언 타입도 저장할 수 있어 유연해 보이지만,  
  **인터페이스**를 사용하면 객체의 구조를 정의하고자 한다는 것을 명확하게 나타낸다.

- 또 **인터페이스**는 클래스 안에 구현할 수 있다.

  > 클래스가 구현해야 하는 구조를 인터페이스로 정의할 수 있다.

- 따라서 객체의 타입을 정의할 때는 **인터페이스**를 자주 사용한다.

#### 인터페이스를 구현한 클래스

```ts
interface Greetable {
  name: string;
  greet(text: string): void;
}

// 인터페이스의 name, greet를 클래스에 구현해야 함.
class Person implements Greetable {
  name: string;
  age = 30;

  constructor(n: string) {
    this.name = n;
  }

  greet(text: string): void {
    console.log(text + ' ' + this.name);
  }
}

let user1: Person;

user1 = new Person('Kim');
user1.greet('Hello, My name is');
console.log(user1); // 'Hello, My name is Kim'
```

### 인터페이스로 함수 정의

```ts
// type 사용: 일반적인 방법
type AddFn = (a: number, b: number) => number;

// interface 사용
interface AddFn {
  (a: number, b: number): number;
}
```

### 선택적 프로퍼티

인터페이스나 클래스에서 프로퍼티명 뒤에 물음표를 붙여 선언할 수 있다.

- 메서드에도 적용 가능

```ts
interface Named {
  readonly name?: string;
}

class Person implements Name {
  name?: string;

  constructor(n?: string) {
    if (n) {
      // name이 선택적 프로퍼티이므로 n이 있는 경우에만
      this.name = n;
    }
  }
}
```
