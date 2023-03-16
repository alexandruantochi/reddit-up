import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {filter, map, Observable, of, switchMap} from "rxjs";

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css']
})
export class SearchComponentComponent {

  username: string = "";
  public currentUsername: Observable<string | null>;

    constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
      this.currentUsername = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.root.firstChild),
        switchMap(firstChild => {
          if(firstChild) {
            return firstChild.paramMap.pipe(map(paramMap => paramMap.get("username")))
          } else {
            return of(null)
          }
        })
      );

      this.currentUsername.subscribe((newUsername) => {
        if (newUsername !== null){
          this.username = newUsername;
        } else {
          this.username = "";
        }
      })

    }



  openUserPage() {
        this.router.navigate([`/user/${this.username}`]);
  }


}
