// Code goes here!
const app = document.getElementById('app')! as HTMLDivElement;
const items = document.getElementById('single-project')! as HTMLTemplateElement;

function render() {
  const inputTemplate = document.getElementById(
    'project-input'
  )! as HTMLTemplateElement;
  const projectsTemplate = document.getElementById(
    'project-list'
  )! as HTMLTemplateElement;

  const form = document.importNode(inputTemplate.content, true);
  const todos = document.importNode(projectsTemplate.content, true);
  const finished = document.importNode(projectsTemplate.content, true);

  form.children[0].id = 'user-input';

  todos.children[0].id = 'todos-projects';
  todos.children[0].children[0].textContent = 'Todos';

  finished.children[0].id = 'finished-projects';
  finished.children[0].children[0].textContent = 'Finished';

  app.append(form.children[0], todos.children[0], finished.children[0]);
}

render();

const userInput = document.getElementById('user-input')! as HTMLFormElement;
const formControls = userInput.querySelectorAll('.form-control')! as NodeList;
const titleInput = userInput.querySelector('#title')! as HTMLInputElement;
const descriptionInput = userInput.querySelector(
  '#description'
)! as HTMLTextAreaElement;
const peopleInput = userInput.querySelector('#people')! as HTMLInputElement;

interface inputType {
  title: string;
  description: string;
  people: string;
}

let inputValues: inputType = {
  title: '',
  description: '',
  people: '',
};

function changeInput(event: any) {
  const id = event.target.id;
  const value = event.target.value;

  inputValues = {
    ...inputValues,
    [id]: value,
  };
}

function resetInputs() {
  inputValues = {
    title: '',
    description: '',
    people: '',
  };

  titleInput.value = inputValues.title;
  descriptionInput.value = inputValues.description;
  peopleInput.value = inputValues.title;
}

const todos = document.getElementById('todos-projects')!;

function addItem(event: Event) {
  event.preventDefault();

  if (!inputValues.title || !inputValues.description || !inputValues.people) {
    alert('Error: Invalid value.');
    resetInputs();

    return;
  }

  const li = document.importNode(items.content, true).children[0];
  const h2 = document.createElement('h2')! as HTMLHeadingElement;
  const h3 = document.createElement('h3')! as HTMLHeadingElement;
  const p = document.createElement('p')! as HTMLParagraphElement;

  h2.textContent = inputValues.title;
  h3.textContent = inputValues.description;
  p.textContent = inputValues.people;

  li.append(h2, h3, p);
  todos.children[1].append(li);

  resetInputs();
}

const button = document.querySelector('button')! as HTMLButtonElement;

button.addEventListener('click', addItem);
