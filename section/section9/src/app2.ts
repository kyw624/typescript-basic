enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private id: number = 0;
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }

  generateId() {
    this.id += 1;

    return this.id;
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      this.generateId(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  return adjustDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateElementId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateElementId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild! as U;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    }

    return `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, `${project.id}`);

    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];
    this.element.id = `${this.type}-projects`;

    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }

        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;

    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toLocaleUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = '';

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Error: Invalid input!');
      return;
    }

    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;

      projectState.addProject(title, description, people);
      console.log(projectState);
    }

    this.clearInputs();
  }
}

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
//       console.log(projectState);
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

const projectInput = new ProjectInput();
const activeList = new ProjectList('active');
const finishedList = new ProjectList('finished');
