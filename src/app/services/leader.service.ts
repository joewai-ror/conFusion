import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import {Promotion} from '../shared/promotion';
import {PROMOTIONS} from '../shared/promotions';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import {Dish} from '../shared/dish';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})

export class LeaderService {
  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }
  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>( baseURL + 'leadership').pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + id).pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
  }
  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>( baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  }
}
