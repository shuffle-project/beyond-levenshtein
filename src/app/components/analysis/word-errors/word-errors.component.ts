import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-word-errors',
  standalone: true,
  imports: [MatCardModule, BaseChartDirective],
  templateUrl: './word-errors.component.html',
  styleUrl: './word-errors.component.scss',
})
export class WordErrorsComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public labels: string[] = ['Insertions', 'Deletions', 'Substitutions'];
  public datasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  public options: ChartConfiguration<'doughnut'>['options'] = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
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

  ngOnInit() {
    this.appService.measures$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((measures) => {
        this.datasets = [
          {
            data: [measures.words.ins, measures.words.del, measures.words.sub],
            backgroundColor: [
              this.displayService.colors.green,
              this.displayService.colors.red,
              this.displayService.colors.blue,
            ],
          },
        ];
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
