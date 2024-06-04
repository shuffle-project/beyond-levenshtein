import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LetDirective } from '@ngrx/component';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, Subject, map } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-normalisations',
  standalone: true,
  imports: [MatCardModule, BaseChartDirective, LetDirective],
  templateUrl: './normalisations.component.html',
  styleUrl: './normalisations.component.scss',
})
export class NormalisationsComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public labels!: string[];

  public datasets$: Observable<
    ChartConfiguration<'doughnut'>['data']['datasets']
  > = this.appService.measures$.pipe(
    map((o) => {
      this.labels = Object.keys(o.normalisations).map((o) =>
        o
          .split('')
          .map((c, i) => (i === 0 ? c.toUpperCase() : c))
          .join('')
      );
      return [
        {
          data: Object.values(o.normalisations),
          backgroundColor: Object.values(this.displayService.colors),
        },
      ];
    })
  );

  public options: ChartConfiguration<'doughnut'>['options'] = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        maxWidth: 400,
        labels: {
          boxHeight: 10,
          boxWidth: 10,
        },
      },
    },
    radius: 100,
  };

  constructor(
    private appService: AppService,
    private displayService: DisplayService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
