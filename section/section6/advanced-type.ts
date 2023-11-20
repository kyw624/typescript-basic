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

type Combinable = string | number;
type Numeric = number | boolean;

// 공통된 number를 Universal의 타입으로 판단
type Universal = Combinable & Numeric;

////
// 함수 오버로딩
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: Combinable, b: Combinable) {
  // 이 부분을 타입 가드라 함.
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }

  return a + b;
}

const result = add(1, 2);

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);

  if ('privileges' in emp) {
    console.log('Privileges: ' + emp.privileges);
  }

  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate);
  }
}

printEmployeeInformation({ name: 'Manu', startDate: new Date() });

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

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();

  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
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

moveAnimal({ type: 'bird', flyingSpeed: 10 });

////
// 타입 캐스팅
const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')
);

userInputElement.value = 'Hi there!';

////
// 인덱스 타입
interface ErrorContainer {
  [prop: string]: string; // or key
}

const errorBag: ErrorContainer = {
  email: '이메일이 유효하지 않습니다.',
  username: '대문자로 시작해야합니다.',
};

////
// 옵셔널 체이닝
const fetchedUserDate = {
  id: 'u1',
  name: 'Kim',
  job: { title: 'CEO', description: 'My own company' },
};
console.log(fetchedUserDate?.job?.title);

////
// Null 병합 연산자
const userInput = '';
const storedData = userInput ?? 'DEFAULT';
console.log(storedData); // ''

const userInput2 = null;
const storedData2 = userInput2 ?? 'DEFAULT';
console.log(storedData2); // 'DEFAULT'
