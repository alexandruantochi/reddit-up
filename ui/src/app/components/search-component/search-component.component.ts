import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css']
})
export class SearchComponentComponent {

  @ViewChild('username', { static: true }) input: ElementRef | undefined;

  constructor(private router: Router) { }


  onKeyDownEvent(event: any) {
    this.router.navigate([`/user/${this.input?.nativeElement.value}`])
  }
}
