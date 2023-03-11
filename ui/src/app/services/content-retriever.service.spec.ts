import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ContentRetrieverService } from './content-retriever.service';

describe('ContentRetrieverService', () => {
  let service: ContentRetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ContentRetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create the http req observable and subscribe', () => {
    expect(service.getUserSubmittedData('kattheissy')).toBeTrue();
  })
});
