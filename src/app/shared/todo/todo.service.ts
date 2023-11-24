import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Todo} from "../interfaces/todo";

type Data = {
  data: Todo[]
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  http: HttpClient = inject(HttpClient);
  url: string = environment.endpoint;
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  getTodos(): Observable<Data> {
    return this.http.get(`${this.url}/todos`) as Observable<Data>;
  }

  editTodo(editedTodo: Todo): Observable<Data> {
    return this.http.patch(`${this.url}/todos`, {editedTodo}, {headers: this.headers}) as Observable<Data>;
  }

  deleteTodo(todoId: number): Observable<Data> {
    return this.http.delete(`${this.url}/todos/${todoId}`) as Observable<Data>;
  }

  addTodo(newTodo: Todo): Observable<Data> {
    return this.http.post(`${this.url}/todos`, {newTodo}, {headers: this.headers}) as Observable<Data>;
  }
}
