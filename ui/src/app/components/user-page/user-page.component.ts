import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContentRetrieverService } from 'src/app/services/content-retriever.service';
import { UserAboutData, UserSubmittedData, UserPost, userPostType } from 'src/app/constants/types';
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

export class UserPageComponent implements OnInit {

  public retrievingData: boolean;
  public notFound: boolean = false;
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
      if (!currentUsername) {
        return;
      }
      this.retrievingData = true;
      this.contentRetriever.popularRedditor(currentUsername);
      let userDataPromise = this.contentRetriever.getUserSubmittedData(currentUsername);
      userDataPromise.subscribe({
        next: (data: UserSubmittedData) => {

          this.setPageTitle(currentUsername);
          this.viewHistoryService.addUsernameToHistory(currentUsername);

          if (!data.data.children.length) {
            this._snackBar.open(`${currentUsername} has no posts :(`, "", {
              duration: 3000
            });
          } else {
            this.displayImages(data.data.children);
          }
        },
        error: (e: HttpErrorResponse) => {
          this.retrievingData = false;

          switch (e.status) {
            case 403:
              this.defaultSnackbar(`${currentUsername} was suspended/deleted.`);
              break;
            case 404:
              this.defaultSnackbar(`Can't find ${currentUsername}.`);
              this.notFound = true;
              break;
            case 777:
              this.defaultSnackbar(`Sorry, Reddit is dead. ☠️`);
              break;
            default:
              this.defaultSnackbar(`An unexpected error has occurred: HTTP ${e.status}`);
              break;
          }
        }
      });
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

    const userSubmittedUrlsToCheck = filteredUserData
      .filter(entry => {
        const entryType = this.getEntryType(entry);
        return entryType !== undefined && entryType !== 'redgif' && entryType !== 'gallery';
      })
      .map(x => x.data.url);

    this.contentRetriever.getUrlsWithTheSameEtag(userSubmittedUrlsToCheck).subscribe({
      next: (sameImageUrls) => {
        let sameImageUrlsSet = new Set(sameImageUrls);
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
    this.retrievingData = false;
    this.galleryList = [];
    for (let entry of filteredUserData) {

      const userPostType = this.getEntryType(entry);

      if (userPostType === 'self') {
        continue;
      }
      else if (userPostType === 'imgur-gifv') {
        let newUrl = entry.data.url.split('/')[3].split('.')[0];
        this.galleryList.push(new VideoItem({
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
      else if (userPostType === 'image') {
        this.galleryList.push(new ImageItem({ src: entry.data.url, thumb: entry.data.thumbnail }));
      } else if (userPostType === 'redgif') {
        this.galleryList.push(new IframeItem({ src: entry.data.url.replace('watch', 'ifr'), thumb: entry.data.thumbnail }));
      }
    }

    if (!this.galleryList.length) {
      this.defaultSnackbar("Nothing to display for this user :(");
    } 
  };

  getEntryType(entry: UserPost): userPostType {
    const entryDataType = entry.data.post_hint;
    if (entry.data.url.includes('onlyfans') || entry.data.thumbnail === 'self') {
      return 'self';
    };
    if (entry.data.domain.endsWith('imgur.com') && entry.data.url.endsWith('.gifv')) {
      return 'imgur-gifv';
    };
    if (entryDataType === 'image') {
      return 'image';
    };
    if (entryDataType === 'rich:video' && entry.data.url.includes('redgifs')) {
      return 'redgif';
    };
    if (entry.data.is_gallery){
      return 'gallery';
    }
    return;
  }

  setPageTitle(currentUsername: string): void {
    let userAboutPromise = this.contentRetriever.getUserAboutDetails(currentUsername);
    userAboutPromise.subscribe({
      next: (data: UserAboutData) => {
        this.titleService.setTitle(`${data.data.subreddit.title} (${data.data.subreddit.display_name_prefixed}) - Up for Reddit`);
      }
    });
  }

  defaultSnackbar(message: string): void {
    this._snackBar.open(message, "", {
      duration: 3000
    });
  };

}

