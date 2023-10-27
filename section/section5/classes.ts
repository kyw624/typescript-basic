abstract class Department {
  // (2) private 키워드를 속성, 메서드에 명시해 외부에서의 액세스 방지
  // 아무것도 명시하지 않으면 public. 바닐라 JS에는 존재하지 않음
  // private name: string;

  // (4) readonly: 초기화 후 수정 불가능하도록 (JS에서는 지원 X)
  // private readonly id: string;
  protected employees: string[] = [];

  // (3) 생성자 함수에 접근 제한 키워드 선언
  // (3)-1. 기존 방식
  // constructor(n: string) {
  //   this.name = n;
  // }
  //
  // (3)-2. 생성자 함수로 선언시 함께 명시
  // - 암묵적으로 클래스 프로퍼티로 선언되어 사전에 별도의 초기화가 불필요
  constructor(protected readonly id: string, public name: string) {
    this.name = name;
  }

  // (1) this를 매개변수로 전달해 예상치 못한 참조 에러 방지
  abstract describe(this: Department): void;

  addEmployee(employees: string) {
    // (4) Error: 수정 불가
    // this.id = 'd2';
    this.employees.push(employees);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  admins: string[];

  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins;
  }

  describe() {
    console.log('IT Department - ID: ' + this.id);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }

    throw new Error('리포트가 없습니다.');
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('입력값 오류');
    }

    this.reports.push(value);
  }

  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.reports = reports;
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new AccountingDepartment('d2', []);
    return this.instance;
  }

  describe() {
    console.log('Accounting Department - ID: ' + this.id);
  }

  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }
}

const it = new ITDepartment('d1', ['Max']);

//// (1)
// (1)-1. this 키워드 미지정: 참조 대상이 잘못되어 undefined 반환
// const accountingCopyError = { describe: accounting.describe };
// accountingCopyError.describe(); // "Department: undefined"
//
// (1)-2. this 키워드 지정: name 프로퍼티의 값을 전달해 객체 생성
// const accountingCopy = { name: 'DUMMY', describe: accounting.describe };
// accountingCopy.describe(); // "Department: DUMMY"

it.addEmployee('Max');
it.addEmployee('Manu');

//// (2) BAD - 클래스 외부에서 프로퍼티에 직접 액세스해 수정
// private 키워드를 활용하면 방지할 수 있음.
// accounting.employees[2] = 'Anna';

it.describe();
it.name = 'NEW NAME';
it.printEmployeeInformation();

console.log(it);

// const accounting = new AccountingDepartment('d1', ['r1', 'r2']);
// accounting.addReport('Added report!');
// accounting.printReports();

class Department1 {
  protected employees: string[] = [];

  constructor(private id: string, public name: string) {
    this.name = name;
  }

  addEmployee(employees: string) {
    this.employees.push(employees);
  }
}

class Department2 extends Department1 {
  constructor(id: string, private reports: string[]) {
    super(id, '회계');
    this.reports = reports;
  }

  addReport(report: string) {
    this.reports.push(report);
  }

  addEmployee(employees: string): void {}
}
