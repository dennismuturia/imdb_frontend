import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImdbService, Movie } from '../../api/imdb.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  templateUrl: './moviedetail.html',
  styleUrl: './moviedetail.css',
})
export class MovieDetails implements OnInit {
  movieId!: number;

  movie: Movie | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ImdbService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.movieId = idParam ? Number(idParam) : NaN;

    if (!Number.isFinite(this.movieId)) {
      this.error = 'Invalid movie id';
      return;
    }

    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    console.log(`Fetching movie details for ID: ${this.movieId}`);

    this.api.getMovieById(this.movieId)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: m => {
          this.movie = m;
        },
        error: err => {
          console.error('Error fetching movie details:', err);
          this.error = err?.error?.message || err?.message || 'Failed to load movie';
        },
      });
  }

  backToActors() {
    this.router.navigate(['/actors']);
  }

  backToMovies() {
    this.router.navigate(['/movies']);
  }
}
