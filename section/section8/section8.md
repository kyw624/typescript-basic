# 8. 데코레이터

### 1. 데코레이터란?

### 2. 데코레이터 유형

### 3. 예제를 통한 데코레이터의 역할과 활용 방식

---

<br>

## 1. 데코레이터란?

### 1. 데코레이터는 함수다.

### 2. 데코레이터 이름은 대문자로 시작한다.

```ts
function Logger() {
  console.log('Logging...');
}
```

### 3. 사용하려는 클래스 위에 @와 함께 사용한다.

```ts
@Logger
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}
```

### 4. 데코레이터는 인자가 필요하다.

타겟 클래스의 생성자 함수를 넘겨줘야하고, 인자에 타입과 개수는 제한이 없다.

```ts
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}
```

### 5. 데코레이터는 클래스가 정의될 때 실행된다.

실행하면 pers 객체보다 데코레이터의 로그가 먼저 출력된다.

```ts
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);
```

> 출력

```ts
// (1) 데코레이터
Logging...
class Person {
 constructor() {
     this.name = 'Max';
     console.log('Creating person object...');
 }
}

// (2) Person 인스턴스
Creating person object...
Person {name: 'Max'}
```

### 6. 여러 개의 데코레이터가 등록되면 밑에 있는 데코레이터가 먼저 실행된다.

1. WithTemplate 실행
2. Logger 실행

   ```ts
   @Logger
   @WithTemplate('<h1>My Person Object</h1>', 'app')
   class Person {
     name = 'Max';

     constructor() {
       console.log('Creating person object...');
     }
   }
   ```

그러나 데코레이터도 결국 함수이기 때문에 데코레이터 팩토리는 먼저 실행된다.

1. LoggerFactory 실행
2. WithTemplate 실행

   ```ts
   @LoggerFactory('LOGGING - PERSON')
   @WithTemplate('<h1>My Person Object</h1>', 'app')
   class Person {
     name = 'Max';

     constructor() {
       console.log('Creating person object...');
     }
   }
   ```

<br>

## 2. 데코레이터 유형

### 1. 데코레이터 팩토리

팩토리 함수를 통해 데코레이터 함수가 실행될 때 사용할 값을 인자로 받아 지정하는 등의 활용이 가능하다.

```ts
function LoggerFactory(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@LoggerFactory('LOGGING - PERSON') // 인자로 logString 값 전달
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}
```

> 출력

```ts
LOGGING - PERSON
class Person {
    constructor() {
        this.name = 'Max';
        console.log('Creating person object...');
    }
}
Creating person object...
Person {name: 'Max'}
```

### 2. 속성 & 접근자 & 메서드 & 매개변수 데코레이터

클래스가 정의되는 시점에 실행된다.

이런 특징을 활용해 클래스가 정의될 때 배후에서 부가적인 설정 작업이 가능하다.

- 속성, 매개변수 데코레이터는 반환값이 사용되지 않는다.
- 접근자, 메서드 데코레이터는 반환값이 사용된다.
  - 새로운 설명자 객체를 반환할 수 있다.

#### 1) 속성 데코레이터

```ts
function Log(target: any, propertyName: string | Symbol) {
  console.log('속성 데코레이터!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;

  // ...
}
```

#### 2) 접근자 데코레이터

```ts
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('접근자 데코레이터!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Product {
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Error: Invalid price');
    }
  }

  // ...
}
```

#### 3) 메서드 데코레이터

```ts
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log('메서드 데코레이터!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Product {
  private _price: number;

  @Log3
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

#### 4) 매개변수 데코레이터

3개의 인자를 받는다.

- 타겟
- 매개변수를 사용하는 메서드의 이름
- 매개변수의 위칫값 (매개변수의 순서 번호)

```ts
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('매개변수 데코레이터!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  private _price: number;

  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
```

<br>

## 3. 예제를 통한 데코레이터의 역할과 활용 방식

### 1. 요소를 생성하는 데코레이터

1.  특정 id를 가진 요소에 특정 문구를 가진 요소를 렌더링

    ```ts
    function WithTemplate(template: string, hookId: string) {
      return function (_: Function) {
        const hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.innerHTML = template;
        }
      };
    }

    @WithTemplate('<h1>My Person Object</h1>', 'app')
    class Person {
      name = 'Max';

      constructor() {
        console.log('Creating person object...');
      }
    }
    ```

2.  생성자 함수를 활용해 인스턴스값을 가진 요소를 렌더링

    ```ts
    function WithTemplate(template: string, hookId: string) {
      return function (constructor: any) {
        const hookEl = document.getElementById(hookId);
        const person = new constructor();

        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = person.name;
        }
      };
    }

    @WithTemplate('<h1>My Person Object</h1>', 'app')
    class Person {
      name = 'Max';

      constructor() {
        console.log('Creating person object...');
      }
    }
    ```

### 2. 데코레이터 함수 내부에서 클래스 반환

배후에서 기존 클래스를 새 클래스로 대체하는 데코레이터로,  
상속이 가능한 점을 활용해 기존 클래스를 상속한 코드이다.

```ts
function WithTemplate(template: string, hookId: string) {
  // 생성자 함수를 뜻하는 new를 상속
  return function <T extends {new(...args: any[]): {name: string}} (originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super(); // 상속받았기때문에 호출 필요

        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        const person = new originalConstructor();

        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}
```

### 3. 자동으로 this를 바인딩해주는 데코레이터

> 기존 코드

버튼을 클릭해 showMessage 호출 시 `undefined`가 출력된다.

```ts
class Printer {
  message = 'This works!';

  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
const button = document.querySelector('button')!;

button.addEventListener('click', p.showMessage);
```

> Autobind 데코레이터

버튼을 클릭하면 `This works!`가 출력되며 원하는대로 작동을 한다.

이벤트 리스너에 등록할 때 `this`를 직접 `bind`해주는 방법도 있지만  
데코레이터를 활용한다면 이런 번거로움을 줄일 수 있다.

```ts
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjustDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}
```

### 4. 유효성 검증용 데코레이터

> 기존 코드

Input에 값이 비어있어도 객체가 생성된다.

```ts
class Course {
  title: string;
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  console.log(createdCourse);
});
```

> 검증을 위한 코드

1. 검증값을 담아둘 객체

   ```ts
   interface ValidatorConfig {
     [property: string]: {
       [validatableProp: string]: string[]; // ['required', 'positive']
     };
   }

   const registeredValidators: ValidatorConfig = {};
   ```

2. 검증 데코레이터

   ```ts
   function Required(target: any, propertyName: string) {
     registeredValidators[target.constructor.name] = {
       ...registeredValidators[target.constructor.name],
       [propertyName]: [
         ...(registeredValidators[target.constructor.name]?.[propertyName] ??
           []),
         'required',
       ],
     };
   }

   function PositiveNumber(target: any, propertyName: string) {
     registeredValidators[target.constructor.name] = {
       ...registeredValidators[target.constructor.name],
       [propertyName]: [
         ...(registeredValidators[target.constructor.name]?.[propertyName] ??
           []),
         'positive',
       ],
     };
   }
   ```

3. 검증 로직

   ```ts
   function validate(obj: any) {
     const objValidatorConfig = registeredValidators[obj.constructor.name];

     if (!objValidatorConfig) {
       return true;
     }

     let isValid = true;

     for (const prop in objValidatorConfig) {
       for (const validator of objValidatorConfig[prop]) {
         switch (validator) {
           case 'required':
             isValid = isValid && !!obj[prop];
             break;

           case 'positive':
             isValid = isValid && obj[prop] > 0;
             break;
         }
       }
     }

     return isValid;
   }
   ```

> 유효성 검증 기능 적용

```ts
class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert('Invalid input');
    return;
  }

  console.log(createdCourse);
});
```
