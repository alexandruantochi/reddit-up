import { Component } from '@angular/core';
import { ContentRetrieverService } from "../../services/content-retriever.service";
import { UserAboutData } from "../../constants/types";
import { ViewHistoryService } from "../../services/view-history.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

  viewHistory: UserAboutData[] = [];
  constructor(
    private contentRetriever: ContentRetrieverService,
    private viewHistoryService: ViewHistoryService,
    private titleService: Title) {

    this.titleService.setTitle(`Up for Reddit`);

    this.contentRetriever.getMultipleUserAboutData(this.viewHistoryService.getUserViewHistory()).subscribe((history) => {
      this.viewHistory = history;
    })

  }

  removeUserFromHistory(username: string) {
    this.viewHistoryService.removeUserFromHistory(username);
    this.contentRetriever.getMultipleUserAboutData(this.viewHistoryService.getUserViewHistory()).subscribe((history) => {
      this.viewHistory = history;
    })
  }
}
