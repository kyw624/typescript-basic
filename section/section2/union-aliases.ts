// Type Alias
type Combinable = number | string;
type ConversionDescriptor = 'as-number' | 'as-text';

function combine(
  // input1: number | string,
  // input2: number | string,
  // resultConversion: 'as-number' | 'as-text' // 유니온 & 리터럴 타입
  input1: Combinable, // type alias
  input2: Combinable, // type alias
  resultConversion: ConversionDescriptor // type alias
) {
  // const result = input1 + input2;
  // return result;

  // string끼리의 + 연산자 에러 해결
  let result;
  if (
    (typeof input1 === 'number' && typeof input2 === 'number') ||
    resultConversion === 'as-number'
  ) {
    result = +input1 + +input2;
  } else {
    result = input1.toString() + input2.toString();
  }

  return result;

  // if (resultConversion === 'as-number') {
  //   return +result;
  // } else {
  //   return result.toString();
  // }
}

const combinedAges = combine(30, 26, 'as-number');
console.log(combinedAges);

const combinedStringAges = combine('30', '26', 'as-number');
console.log(combinedStringAges);

const combinedNames = combine('Max', 'Anna', 'as-text');
console.log(combinedNames);
