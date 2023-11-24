import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TodoComponent} from './todo.component';
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TodoService} from "../shared/todo/todo.service";
import {Observable, of} from "rxjs";

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockTodoService = {
    getTodos: () => new Observable(),
    editTodo: () => new Observable(),
    deleteTodo: () => new Observable(),
    addTodo: () => new Observable()
  }
  let mockTodo = { id: 1, title: 'Test Todo', completed: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TodoComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch todos on initialization', () => {
    const mockTodos = [mockTodo];
    jest.spyOn(mockTodoService, 'getTodos').mockReturnValue(of({data: mockTodos}))

    component.ngOnInit();

    expect(mockTodoService.getTodos).toHaveBeenCalled();
    expect(component.todoList).toEqual(mockTodos);
  });

  it('should test add a new todo', () => {
    const newTodoTitle = 'New Todo';
    jest.spyOn(mockTodoService, 'addTodo').mockReturnValue(of({data: []}))

    component.newTodo.setValue(newTodoTitle);
    component.addTodo();

    expect(mockTodoService.addTodo).toHaveBeenCalledWith({
      id: expect.any(Number),
      title: newTodoTitle,
      completed: false
    });
  });

  it('should fail to add a new todo', () => {
    const newTodoTitle = '';
    jest.spyOn(mockTodoService, 'addTodo');

    component.newTodo.setValue(newTodoTitle);
    component.addTodo();

    expect(mockTodoService.addTodo).not.toHaveBeenCalled();
  });

  it('should complete a todo', () => {
    jest.spyOn(mockTodoService, 'editTodo').mockReturnValue(of({data: []}))

    component.completeTodo(mockTodo);

    expect(mockTodoService.editTodo).toHaveBeenCalledWith({ ...mockTodo, completed: true });
  });

  it('should delete a todo', () => {
    const mouseEvent = {stopPropagation: ()=>{}} as MouseEvent
    jest.spyOn(mockTodoService, 'deleteTodo').mockReturnValue(of({data: []}))

    component.deleteTodo(mouseEvent, mockTodo.id);

    expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should edit a todo', () => {
    jest.spyOn(mockTodoService, 'editTodo').mockReturnValue(of({data: []}))

    component.changeEditing(0, mockTodo.title);
    component.editTodoTitle(mockTodo);

    expect(mockTodoService.editTodo).toHaveBeenCalledWith(mockTodo);
  });

});
