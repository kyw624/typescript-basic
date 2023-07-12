////
// unknown type
var userInput;
var userName;
userInput = 5;
userInput = 'Max';
// userName = userInput; // 에러. userInput이 any타입이면 에러없음.
// unknown은 해당 변수에 저장된 타입을 확인해야 할당 가능.
if (typeof userInput === 'string') {
    userName = userInput; // 정상작동
}
////
// never type
function generateError(message, code) {
    throw {
        message: message,
        errorCode: code,
    };
}
generateError('에러 발생!', 500);
