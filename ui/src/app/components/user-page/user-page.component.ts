import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentRetrieverService } from 'src/app/services/content-retriever.service';
import { UserAboutData, UserPost, UserSubmittedData } from 'src/app/constants/types';
import { GalleryItem, IframeItem, ImageItem, VideoItem } from 'ng-gallery';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from "@angular/common/http";


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})

export class UserPageComponent {

  public userSubmittedData: UserSubmittedData | undefined;
  public retrievingData: boolean;
  public galleryList: GalleryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private contentRetriever: ContentRetrieverService,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {
    this.retrievingData = true;
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let currentUsername = (params.get('username') || "").replaceAll(' ', '').toLowerCase();
      if (currentUsername === "") {
        return;
      }
      this.retrievingData = true;
      this.contentRetriever.popularRedditor(currentUsername);
      let userDataPromise = this.contentRetriever.getUserSubmittedData(currentUsername);
      userDataPromise.subscribe({
        next: (data: UserSubmittedData) => {
          this.retrievingData = false;
          this.displayImages(data.data.children)
        },
        error: (e: HttpErrorResponse) => {
          this.retrievingData = false;
          switch (e.status) {
            case 404:
              () => {
                this._snackBar.open(`Could not find username "${currentUsername}"`,"", {
                  duration: 3000
                });
                console.log(`Could not find username "${currentUsername}"`);
              }
              break;
            default:
              this._snackBar.open(`An unexpected error occurred.`,"", {
                duration: 3000
              });

          }
        }
      }
      );

      let userAboutPromise = this.contentRetriever.getUserAboutDetails(currentUsername);
      userAboutPromise.subscribe({
        next: (data: UserAboutData) => {
          this.retrievingData = false;
          this.titleService.setTitle(`${data.data.subreddit.title} (${data.data.subreddit.display_name_prefixed}) - reddit-up`);
        },
        error: (e: Error) => {
          this.retrievingData = false;
          console.log(`Could not find username "${currentUsername}"`);
        }
      });

    });
  }

  displayImages(userSubmission: any): void {
    this.galleryList = [];
    let images: GalleryItem[] = [];
    let alreadyPostedImage = new Set();
    console.log(userSubmission)
    this.contentRetriever.duplicateContentUrls(userSubmission.map((entry: { data: { thumbnail: any; }; }) => entry.data.thumbnail)).subscribe((urls) => {
      if(urls) {
      userSubmission = userSubmission.filter((entry: any) => {
        return !urls.includes(entry.data.thumbnail)});
      }

      for (let entry of userSubmission) {

        if (alreadyPostedImage.has(entry.data.url)) {
          continue;
        } else {
          alreadyPostedImage.add(entry.data.url);
        }

        let entryDataType: string = entry.data.post_hint;

        if (entry.data.url.includes('onlyfans')) {
          continue;
        }

        if (entry.data.domain === 'i.imgur.com' && entry.data.url.includes('.gifv')) {
          let newUrl = entry.data.url.split('/')[3].split('.')[0];
          images.push(new VideoItem({
            src: [ {
              url : `https://i.imgur.com/${newUrl}.mp4`,
              type: 'video/mp4' } ] as any,
            thumb: entry.data.thumbnail,
            poster: entry.data.thumbnail,
            autoplay: true,
            controls: true,
            loop: true
          }))

        }
        else if (entryDataType === 'image') {
          images.push(new ImageItem({ src: entry.data.url, thumb: entry.data.thumbnail }));
        } else if (entryDataType === 'rich:video' && entry.data.url.includes('redgifs')) {
          images.push(new IframeItem({ src: entry.data.url.replace('watch', 'ifr'), thumb: entry.data.thumbnail }));
        }

      }
      this.galleryList = images;
    });
  }
}
