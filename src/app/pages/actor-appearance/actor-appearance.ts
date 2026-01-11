import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImdbService, Appearance } from '../../api/imdb.service';
import { Location } from '@angular/common';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-actor-appearances',
  standalone: true,
  templateUrl: './actor-appearance.html',
  styleUrl: './actor-appearance.css',
})
export class ActorAppearances implements OnInit {
  actorId!: number;

  appearances: Appearance[] = [];
  page = 0;
  pageSize = 10;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ImdbService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.actorId = idParam ? Number(idParam) : NaN;

    if (!Number.isFinite(this.actorId)) {
      this.error = 'Invalid actor id';
      return;
    }

    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    this.api.getActorAppearances(this.actorId, this.page, this.pageSize)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: res => (this.appearances = res),
        error: err => (this.error = err?.error?.message || err?.message || 'Failed to load appearances'),
      });
  }

  back() {
    this.location.back();
  }

  openMovie(movieId: number) {
    this.router.navigate(['/movies', movieId]);
  }
}
