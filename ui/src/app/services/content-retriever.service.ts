import { Injectable } from '@angular/core';
import { Constants } from '../constants/config.prod';
import { HttpClient } from '@angular/common/http';
import { UserAboutData, UserSubmittedData } from '../constants/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentRetrieverService {

  private readonly redditApiSubmittedUrl: string = '/user/{{username}}/submitted?limit=100&sort=new';
  private readonly redditApiAboutUrl: string = '/user/{{username}}/about';

  private readonly backendUrl: string = "https://reddit-up-api.azurewebsites.net";

  constructor(private http: HttpClient) { };

  getUserSubmittedData(username: string): Observable<UserSubmittedData> {
    let queryParams = {
      limit: 100,
      sort: 'new'
    }
    var contentUrl = Constants.redditApiBaseUrl + this.redditApiSubmittedUrl.replace('{{username}}', username);
    return this.http.get<UserSubmittedData>(contentUrl, { params: queryParams });
  }

  getUserAboutDetails(username: string): Observable<UserAboutData> {
    var contentUrl = Constants.redditApiBaseUrl + this.redditApiAboutUrl.replace('{{username}}', username);
    return this.http.get<UserAboutData>(contentUrl);
  }


  popularRedditor(user: string): void {
    const functionUrl = this.backendUrl + '/api/visited-users?code=3mYTjiLAPqgOEpX5I0f7tbQ6hjEW4w1VX1zSi2K0rn0lAzFuvpPpSA==';
    const queryParams = {
      username: user
    };
    let req = this.http.get(functionUrl, { params: queryParams });
    req.toPromise();
  }

  duplicateContentUrls(urls: string[]): Observable<string[]> {
    const functionUrl = this.backendUrl + '/api/dupe-checker?code=3mYTjiLAPqgOEpX5I0f7tbQ6hjEW4w1VX1zSi2K0rn0lAzFuvpPpSA==';
    return this.http.post<string[]>(functionUrl, { urls });
  }

}
