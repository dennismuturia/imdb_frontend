import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImdbService, Movie } from '../../api/imdb.service';
import { finalize, timeout } from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {
  movies: Movie[] = [];
  name = '';
  page = 0;
  pageSize = 10;
  loading = false;
  error = '';

  constructor(private api: ImdbService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    console.log(`Fetching movies: page=${this.page}, pageSize=${this.pageSize}, name="${this.name}"`);

    this.api.getMovies(this.page, this.pageSize, this.name)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: res => {
          this.movies = res;
        },
        error: err => {
          console.error('Error fetching movies:', err);
          this.error = err?.error?.message || err?.message || 'Failed to load movies';
        },
      });
  }

  next() { this.page++; this.load(); }
  prev() { if (this.page > 0) this.page--; this.load(); }
  search() { this.page = 0; this.load(); }

  openMovie(movieId: number) {
    this.router.navigate(['/movies', movieId]);
  }


}
