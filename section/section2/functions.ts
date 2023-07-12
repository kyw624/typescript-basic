////
// 함수 반환 타입 예제 (void, undefined)
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// void
function printResult(num: number): void {
  console.log('Result: ' + num);
}

// undefined 에러
// function printError(num: number): undefined {
//   console.log('Result: ' + num);
// }

// undefined 정상작동
function printSuccess(num: number): undefined {
  console.log('Result: ' + num);
  return; // return문 추가
}

printResult(add(5, 12));

////
// Function 타입 예제

/**
[Step 1] - Function 타입 미지정
  let combineValues; // any 타입으로 식별

  combineValues = add; // 작동
  combineValues = 5; // 컴파일되지만 런타임

  console.log(combineValues(8, 8));
 */

/**
[Step 2] - Function 타입 지정했으나 함수 정의 X
  let combineValues: Function;

  combineValues = add;
  // combineValues = 5;
  combineValues = printResult; // 에러는 없지만 잘못된 함수를 저장해 오작동

  console.log(combineValues(8, 8)); // add 함수 반환 후 undefined 반환
 */

// [Step 3] - 함수를 정의한 Function 타입 지정
let combineValues: (a: number, b: number) => number;

combineValues = add; // 정상 작동
// combineValues = printResult; // 컴파일 에러

console.log(combineValues(8, 8));

////
// 콜백 함수 예제
function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

addAndHandle(10, 20, (result) => {
  console.log(result); // 30
  return result; // 콜백의 반환 타입이 void 이므로 무시됨.
});
