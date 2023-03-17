import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, of, switchMap} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reddit-up';
  constructor(public router: Router,
              private route: ActivatedRoute){

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route.root.firstChild),
      switchMap(firstChild => {
        if(firstChild) {
          return firstChild.paramMap.pipe(map(paramMap => paramMap.get("username")));
        } else {
          return of(null)
        }
      })
    ).subscribe((username) => {
      if(username) {
        if(username) {
          const l: string[] = JSON.parse(localStorage.getItem("history") || "[]");
          const history: Set<string> = new Set<string>(l);
          if(history.has(username)) {
            history.delete(username);
          }
          history.add(username);
          localStorage.setItem("history", JSON.stringify(Array.from(history)));
        }
      }
    });
  }
}
