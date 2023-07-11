// object 예제
// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string];
// } = {
//   name: 'Youngwoo',
//   age: 28,
//   hobbies: ['Sports', 'Cooking'],
//   role: [2, 'author'],
// };

// enum 예제
// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

enum Role {
  ADMIN, // 0
  READ, // 1
  AUTHOR, // 2
}

const person = {
  name: 'Youngwoo',
  age: 28,
  hobbies: ['Sports', 'Cooking'],
  // role: 'READ ONLY USER',
  role: Role.ADMIN,
};

// Array 예제
let favoriteActivities: string[];
favoriteActivities = ['Sports'];

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

// enum 예제
if (person.role === Role.ADMIN) {
  console.log('is admin');
}
