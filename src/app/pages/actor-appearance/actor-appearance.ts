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

  // ✅ pager flags
  hasNext = false;
  hasPrev = false;

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

    // ✅ compute prev immediately
    this.hasPrev = this.page > 0;

    this.api.getActorAppearances(this.actorId, this.page, this.pageSize)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('[ActorAppearances] API response:', res);
          this.appearances = res ?? [];

          // ✅ allow next only if we got a full page (likely more data exists)
          this.hasNext = this.appearances.length === this.pageSize;

          // ✅ keep prev consistent
          this.hasPrev = this.page > 0;
        },
        error: (err) => {
          console.error('[ActorAppearances] API error:', err);
          this.error =
            err?.error?.message ||
            err?.message ||
            'Failed to load appearances';

          // ✅ on error, disable next (optional)
          this.hasNext = false;
        }
      });
  }

  back() {
    this.location.back();
  }

  next() {
    if (!this.hasNext || this.loading) return;
    this.page++;
    this.load();
  }

  prev() {
    if (!this.hasPrev || this.loading) return;
    this.page--;
    this.load();
  }

  openMovie(movieId: number) {
    this.router.navigate(['/movies', movieId]);
  }
}
