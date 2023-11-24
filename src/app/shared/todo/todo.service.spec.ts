import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Todo} from "../interfaces/todo";
import {environment} from "../../../environments/environment";

describe('TodoService', () => {
  let todoService: TodoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    todoService = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(todoService).toBeTruthy();
  });

  it('should fetch todos', () => {
    const mockTodos: Todo[] = [{ id: 1, title: 'Test Todo', completed: false }];

    todoService.getTodos().subscribe(data => {
      expect(data.data).toEqual(mockTodos);
    });

    const req = httpTestingController.expectOne(`${environment.endpoint}/todos`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTodos });
  });

  it('should edit a todo', () => {
    const editedTodo: Todo = { id: 1, title: 'Edited Todo', completed: true };

    todoService.editTodo(editedTodo).subscribe(data => {
      expect(data.data).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${environment.endpoint}/todos`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ editedTodo });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({ data: {} });
  });

  it('should delete a todo', () => {
    const todoId = 1;

    todoService.deleteTodo(todoId).subscribe(data => {
      expect(data.data).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${environment.endpoint}/todos/${todoId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: {} });
  });

  it('should add a todo', () => {
    const newTodo: Todo = { id: 1, title: 'New Todo', completed: false };

    todoService.addTodo(newTodo).subscribe(data => {
      expect(data.data).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${environment.endpoint}/todos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ newTodo });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({ data: {} });
  });
});
