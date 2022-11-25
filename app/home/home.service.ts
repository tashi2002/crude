import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, take, tap }from 'rxjs/operators'
import { BehaviorSubject, map, of } from 'rxjs';
import { listtodo } from './home.model';
interface dolist{
  sino:string;
 dayy:string;
 activities:string;
 timer:string;
 userId:string;
 
}
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  

  private _items =new BehaviorSubject<listtodo[]>([]);
  get items(){

    return this._items.asObservable();

  };

 
  constructor(private http:HttpClient) { }
  AddItem(
    sino:string,
    dayy:string,
    activities:string,
    timer:string,
  
    )
    {
      let generatedId: string;
      const newItem = new listtodo(
        Math.random().toString(),
        sino,
        dayy,
        activities,
        timer,
        'abc'
       ); 
        return this.http
      .post<{name: string}>
      ("https://mocktest-c44d6-default-rtdb.firebaseio.com/todolist.json",
      {
        ...newItem,
        id: null
      })
      .pipe(
        switchMap(resData =>{
          generatedId = resData.name;
          return this.items; 
        }),
        take(1),
        tap(items =>{
          newItem.id = generatedId;
          this._items.next(items.concat(newItem))
          console.log(dayy,activities,timer);
          
        })
      )  
    }
    fetchitem(){
      return this.http
      .get<{ [key: string]: dolist}>(
        "https://mocktest-c44d6-default-rtdb.firebaseio.com/todolist.json"
      )
      .pipe(
        map(resData =>{
          const items = [];
          for (const key in resData){
            if (resData.hasOwnProperty(key)){
              items.push(
                new listtodo(
                  key,
                  resData[key].sino,
                  resData[key].dayy,
                  resData[key].activities,
                  resData[key].timer,
                  resData[key].userId
                )
              );
            }
          }
          return items;
        }),
        tap(items =>{
          this._items.next(items);
          console.log(items);
        }) 
      )
    }
    getItem(id: string){
      return this.http
      .get<dolist>(
        `https://mocktest-c44d6-default-rtdb.firebaseio.com/todolist/${id}.json`
      )
      .pipe(
        map(lisTo=>{
          return new listtodo(
            id,
           lisTo.sino,
           lisTo.dayy,
           lisTo.activities,
           lisTo.timer,
           lisTo.userId
          );
        }) 
      )
    }
    updateItem(Id: string, dayy: string,activities:string,timer:string, ){
      let updateItems: listtodo[];
      return this.items.pipe(
        take(1),
        switchMap(items => {
          if (!items || items.length <= 0) {
            return this.fetchitem();
          } else {
            return of(items);
          }
        }),
        switchMap(items => {
          const updatedListIndex = items.findIndex(pl => pl.id === Id);
          console.log(updatedListIndex);
          
          updateItems = [...items];
          const oldItems = updateItems[updatedListIndex];
          updateItems[updatedListIndex] = new listtodo (
            oldItems.id,
           oldItems.sino,
           dayy,
           activities,
           timer,
           oldItems.userId
          );
          return this.http.put(
            `https://mocktest-c44d6-default-rtdb.firebaseio.com/todolist/${Id}.json`,
            {...updateItems[updatedListIndex], id: null}
          );
       }),
       tap(()=>{
        this._items.next(updateItems);
       })
     );
    }
    remove(ToDoListId: string){
      return this.http
      .delete(
        `https://mocktest-c44d6-default-rtdb.firebaseio.com/todolist/${ToDoListId}.json`
      )
      .pipe(
        switchMap(()=>{
          return this.items;
        }),
        take(1),
        tap(bookings =>{
          this._items.next(bookings.filter(b => b.id!== ToDoListId));
        })
      );
    }

    nSubject = new BehaviorSubject<string>("");

    send(task:string){
      this.nSubject.next(task);
    }

}