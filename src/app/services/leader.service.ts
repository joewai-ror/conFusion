import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import {Promotion} from '../shared/promotion';
import {PROMOTIONS} from '../shared/promotions';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import {Dish} from '../shared/dish';

@Injectable({
  providedIn: 'root'
})

export class LeaderService {
  constructor(private http: HttpClient) { }
  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>( baseURL + 'leadership');
  }
  getLeader(id: string): Observable<Leader> {
    return this.http.get<Leader>(baseURL + id);
    // return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
  }
  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>( baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]));
    // return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  }
}
