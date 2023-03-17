import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentRetrieverService } from 'src/app/services/content-retriever.service';
import { UserAboutData, UserSubmittedData, UserPost } from 'src/app/constants/types';
import { GalleryItem, IframeItem, ImageItem, VideoItem } from 'ng-gallery';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from "@angular/common/http";
import { ViewHistoryService } from "../../services/view-history.service";


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})

export class UserPageComponent {

  public retrievingData: boolean;
  public galleryList: GalleryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private contentRetriever: ContentRetrieverService,
    private viewHistoryService: ViewHistoryService,
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

          if (data.data.children.length === 0) {
            this._snackBar.open(`Could not find username "${currentUsername}"`, "", {
              duration: 3000
            });
            console.log(`Could not find username "${currentUsername}"`);
          }
          this.displayImages(data.data.children);

          if(currentUsername) {
            this.viewHistoryService.addUsernameToHistory(currentUsername);
          }

          let userAboutPromise = this.contentRetriever.getUserAboutDetails(currentUsername);
          userAboutPromise.subscribe({
            next: (data: UserAboutData) => {
              this.titleService.setTitle(`${data.data.subreddit.title} (${data.data.subreddit.display_name_prefixed}) - Up for Reddit`);
            }
          });
        },
        error: (e: HttpErrorResponse) => {
          this.retrievingData = false;
           if (e.status === 777) {
              this._snackBar.open(`Sorry, Reddit is dead. ☠️`, "", {
                duration: 3000
              });
          } else {
            this._snackBar.open(`An unexpected error occurred.`, "", {
              duration: 3000
            });
          }
        }
      }
      );


    });
  }


  removeSameUrlsFromUserData(rawUserData: UserPost[]): UserPost[] {
    let alreadySeenUrl = new Set();
    return rawUserData.filter(post => {
      if (alreadySeenUrl.has(post.data.url)) {
        return false;
      } else {
        alreadySeenUrl.add(post.data.url);
        return true;
      }
    })
  }

  displayImages(rawUserData: UserPost[]): void {
    let filteredUserData = this.removeSameUrlsFromUserData(rawUserData);
    const userSubmittedUrlsToCheck = filteredUserData.map(x => x.data.url).filter( x => x.startsWith('https://i.redd.it'));
    this.contentRetriever.getUrlsWithTheSameEtag(userSubmittedUrlsToCheck).subscribe({
      next: (sameImageUrls) => {
        let sameImageUrlsSet = new Set(sameImageUrls);
        console.log(sameImageUrls);
        filteredUserData = filteredUserData.filter(x => {
          return !sameImageUrlsSet.has(x.data.url);
        });
      },
      error: (err) => {
        console.log(err.message);
      }
    }).add(() => this.addImagesToGallery(filteredUserData));
  }

  addImagesToGallery(filteredUserData: UserPost[]) {
    this.galleryList = [];
    let images: GalleryItem[] = [];
    for (let entry of filteredUserData) {

      let entryDataType: string = entry.data.post_hint;

      // TODO : should have a look at those, maybe we can add better filtering
      // e.g. replace includes with startsWith
      if (entry.data.url.includes('onlyfans') || entry.data.thumbnail === 'self') {
        continue;
      }

      if (entry.data.domain === 'imgur.com' && entry.data.url.includes('.gifv')) {
        let newUrl = entry.data.url.split('/')[3].split('.')[0];
        images.push(new VideoItem({
          src: [{
            url: `https://i.imgur.com/${newUrl}.mp4`,
            type: 'video/mp4'
          }] as any,
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
  };



}

