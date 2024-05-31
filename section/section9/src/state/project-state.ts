import { Project } from '../models/project';
import { ProjectStatus } from '../models/project';

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
    this.updateListener();

    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(
      (project) => project.id.toString() === projectId
    );

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListener();
    }
  }

  private updateListener() {
    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
