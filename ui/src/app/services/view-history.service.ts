import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewHistoryService {

  constructor() { }

  public addUsernameToHistory(username: string): void {
    username = username.toLowerCase()
    const history: Set<string> = new Set<string>(this.getUserViewHistory());
    if(history.has(username)) {
      history.delete(username);
    }
    history.add(username);
    localStorage.setItem("history", JSON.stringify(Array.from(history)));
  }

  public getUserViewHistory(): string[] {
    const userHistory: string[] = JSON.parse(localStorage.getItem("history") || "[]");
    return userHistory;
  }

  public removeUserFromHistory(username: string): void {
    username = username.toLowerCase();
    const history: Set<string> = new Set<string>(this.getUserViewHistory());
    if(history.has(username)) {
      history.delete(username);
    }
    localStorage.setItem("history", JSON.stringify(Array.from(history)));
  }
}
