import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildPagingParams } from './paging';

export interface Actor {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  year: string;
}
export interface Appearance {
  movie_id: number;
  movie_name: string;
  character_name: string;
}

@Injectable({ providedIn: 'root' })
export class ImdbService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getActors(page: number, pageSize: number, name?: string): Observable<Actor[]> {
    const params = buildPagingParams(page, pageSize, name);
    return this.http.get<Actor[]>(`${this.baseUrl}/actors`, { params });
  }

  getMovies(page: number, pageSize: number, name?: string): Observable<Movie[]> {
    const params = buildPagingParams(page, pageSize, name);
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`, { params });
  }
  getMovieById(movieId: number) {
    return this.http.get<Movie>(`${this.baseUrl}/movies/${movieId}`);
  }

  getActorAppearances(actorId: number, page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', String(page ?? 0))
      .set('page_size', String(pageSize ?? 10));

    return this.http.get<Appearance[]>(
      `${this.baseUrl}/actors/${actorId}/appearances`,
      { params }
    );
  }
}
