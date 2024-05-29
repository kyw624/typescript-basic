import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');

//// 상속을 활용해 리팩터링
//
// class ProjectList {
//   templateElement: HTMLTemplateElement;
//   hostElement: HTMLElement;
//   element: HTMLElement;
//   assignedProjects: Project[];

//   constructor(private type: 'active' | 'finished') {
//     this.templateElement = document.getElementById(
//       'project-list'
//     )! as HTMLTemplateElement;
//     this.hostElement = document.getElementById('app')! as HTMLDivElement;
//     this.assignedProjects = [];

//     const importedNode = document.importNode(
//       this.templateElement.content,
//       true
//     );

//     this.element = importedNode.firstElementChild! as HTMLElement;
//     this.element.id = `${this.type}-projects`;

//     projectState.addListener((projects: Project[]) => {
//       const filteredProjects = projects.filter((project) => {
//         if (this.type === 'active') {
//           return project.status === ProjectStatus.Active;
//         }

//         return project.status === ProjectStatus.Finished;
//       });
//       this.assignedProjects = filteredProjects;
//       this.renderProjects();
//     });

//     this.attach();
//     this.renderContent();
//   }

//   private renderProjects() {
//     const listEl = document.getElementById(
//       `${this.type}-projects-list`
//     )! as HTMLUListElement;

//     listEl.innerHTML = '';

//     for (const projectItem of this.assignedProjects) {
//       const listItem = document.createElement('li');

//       listItem.textContent = projectItem.title;
//       listEl.appendChild(listItem);
//     }
//   }

//   private renderContent() {
//     const listId = `${this.type}-projects-list`;

//     this.element.querySelector('ul')!.id = listId;
//     this.element.querySelector('h2')!.textContent =
//       this.type.toLocaleUpperCase() + ' PROJECTS';
//   }

//   private attach() {
//     this.hostElement.insertAdjacentElement('beforeend', this.element);
//   }
// }

// class ProjectInput {
//   templateElement: HTMLTemplateElement;
//   hostElement: HTMLDivElement;
//   element: HTMLFormElement;
//   titleInputElement: HTMLInputElement;
//   descriptionInputElement: HTMLInputElement;
//   peopleInputElement: HTMLInputElement;

//   constructor() {
//     this.templateElement = document.getElementById(
//       'project-input'
//     )! as HTMLTemplateElement;
//     this.hostElement = document.getElementById('app')! as HTMLDivElement;

//     const importedNode = document.importNode(
//       this.templateElement.content,
//       true
//     );

//     this.element = importedNode.firstElementChild as HTMLFormElement;
//     this.element.id = 'user-input';

//     this.titleInputElement = this.element.querySelector(
//       '#title'
//     ) as HTMLInputElement;
//     this.descriptionInputElement = this.element.querySelector(
//       '#description'
//     ) as HTMLInputElement;
//     this.peopleInputElement = this.element.querySelector(
//       '#people'
//     ) as HTMLInputElement;

//     this.configure();
//     this.attach();
//   }

//   private clearInputs() {
//     this.titleInputElement.value = '';
//     this.descriptionInputElement.value = '';
//     this.peopleInputElement.value = '';
//   }

//   private gatherUserInput(): [string, string, number] | void {
//     const enteredTitle = this.titleInputElement.value;
//     const enteredDescription = this.descriptionInputElement.value;
//     const enteredPeople = this.peopleInputElement.value;

//     const titleValidatable: Validatable = {
//       value: enteredTitle,
//       required: true,
//     };
//     const descriptionValidatable: Validatable = {
//       value: enteredDescription,
//       required: true,
//       minLength: 5,
//     };
//     const peopleValidatable: Validatable = {
//       value: +enteredPeople,
//       required: true,
//       min: 1,
//       max: 5,
//     };

//     if (
//       !validate(titleValidatable) ||
//       !validate(descriptionValidatable) ||
//       !validate(peopleValidatable)
//     ) {
//       alert('Error: Invalid input!');
//       return;
//     }

//     return [enteredTitle, enteredDescription, +enteredPeople];
//   }

//   @Autobind
//   private submitHandler(event: Event) {
//     event.preventDefault();

//     const userInput = this.gatherUserInput();

//     if (Array.isArray(userInput)) {
//       const [title, description, people] = userInput;

//       projectState.addProject(title, description, people);
//     }

//     this.clearInputs();
//   }

//   private configure() {
//     this.element.addEventListener('submit', this.submitHandler);
//   }

//   private attach() {
//     this.hostElement.insertAdjacentElement('afterbegin', this.element);
//   }
// }
