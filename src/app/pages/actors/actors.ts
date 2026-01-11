import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImdbService, Actor } from '../../api/imdb.service';
import { finalize, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';



@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './actors.html',
  styleUrl: './actors.css',
})
export class Actors implements OnInit {
  actors: Actor[] = [];
  name = '';
  page = 0;
  pageSize = 10;
  loading = false;
  error = '';


  constructor(private api: ImdbService, private cdr: ChangeDetectorRef, private router: Router, public auth: AuthService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    console.log(`Fetching actors: page=${this.page}, pageSize=${this.pageSize}, name="${this.name}"`);

    this.api.getActors(this.page, this.pageSize, this.name)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: res => {
          console.log('Successfully fetched actors:', res);
          this.actors = res;
        },
        error: err => {
          console.error('Error fetching actors:', err);
          this.error = err?.error?.message || err?.message || 'Failed to load actors';
        },
      });
  }

  next() { this.page++; this.load(); }
  prev() { if (this.page > 0) this.page--; this.load(); }
  search() { this.page = 0; this.load(); }

  openActor(actor: Actor) {
    // actor.id is number from your generated API model
    this.router.navigate(['/actors', actor.id, 'appearances']);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
