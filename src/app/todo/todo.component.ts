import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {TodoService} from "../shared/todo/todo.service";
import {Todo} from "../shared/interfaces/todo";
import {MatChipsModule} from "@angular/material/chips";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatListModule, MatInputModule, MatCheckboxModule, MatIconModule, MatChipsModule, FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {

  todoService: TodoService = inject(TodoService);
  @ViewChild('editTodoInput') editTodoInput!: ElementRef;
  todoList: Todo[] = [];
  todoFilter: string = 'all';
  newTodo = new FormControl('');
  editing: boolean = false;
  editingIndex: number | null = null;
  editingTitle: string = '';
  todosCompleted: number = 0;
  todosPending: number = 0;


  ngOnInit(): void {
    this.todoService.getTodos().subscribe(({data}) => {
      this.setTodosList(data);
    })
  }

  setTodosList(todosList: Todo[]) {
    this.todoList = todosList
    this.todosCompleted = this.todoList.filter(todo => todo.completed).length;
    this.todosPending = this.todoList.filter(todo => !todo.completed).length;
  }

  sortTodo(todoList: Todo[]): Todo[] {
    return todoList.sort((a, b) => a.completed === b.completed ? 0 : (a.completed ? 1 : -1))
  }

  filterTodos(): Todo[] {
    return this.sortTodo(this.todoList.filter((todo) => this.todoFilter === 'completed' && todo.completed || this.todoFilter === 'pending' && !todo.completed || this.todoFilter === 'all'));
  }

  addTodo(): void {
    if (this.newTodo.value && this.newTodo.value !== '') {
      this.todoService.addTodo({
        id: this.todoList.length,
        title: this.newTodo.value,
        completed: false
      }).subscribe(({data}) => {
        this.setTodosList(data);
      })
    }
  }

  completeTodo(completedTodo: Todo): void {
    console.log(completedTodo)
    this.todoService.editTodo({...completedTodo, completed: !completedTodo.completed}).subscribe(({data}) => {
      this.setTodosList(data);
    })
  }

  deleteTodo($event: MouseEvent, todoId: number): void {
    $event.stopPropagation();
    this.todoService.deleteTodo(todoId).subscribe(({data}) => {
      this.setTodosList(data);
    })
  }

  changeEditing(index: number | null, title?: string): void {
    this.editing = index !== null;
    this.editingIndex = index;
    this.editingTitle = title ? title : '';
    if (index !== null) {
      setTimeout(() => {
        this.editTodoInput.nativeElement.focus();
      });
    }
  }

  editTodoTitle(editedTodo: Todo): void {
    this.todoService.editTodo({...editedTodo, title: this.editingTitle.trim()}).subscribe(({data}) => {
      this.changeEditing(null);
      this.setTodosList(data);
    });
  }
}
