import { Component } from '@angular/core';
import {ContentRetrieverService} from "../../services/content-retriever.service";
import {UserAboutData} from "../../constants/types";
import {flatMap, map, Observable, of, switchMap, tap, toArray} from "rxjs";
import {ViewHistoryService} from "../../services/view-history.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

  viewHistory: UserAboutData[] = [];
  constructor(
    private contentRetriever: ContentRetrieverService,
    private viewHistoryService: ViewHistoryService) {

    this.contentRetriever.getMultipleUserAboutData(this.viewHistoryService.getUserViewHistory()).subscribe((history) => {
      this.viewHistory = history;
    })
  }
}
