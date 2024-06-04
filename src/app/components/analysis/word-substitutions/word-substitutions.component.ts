import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../../../services/app.service';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-word-substitutions',
  standalone: true,
  imports: [MatCardModule, BaseChartDirective],
  templateUrl: './word-substitutions.component.html',
  styleUrl: './word-substitutions.component.scss',
})
export class WordSubstitutionsComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public labels: string[] = [
    'Affixes',
    'Capitalisation',
    'Compound Words',
    'Homophones',
    'Numbers',
    'Prefixes',
    'Stemmers',
    'Suffixes',
    'Unspecified',
  ];

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
            data: [
              measures.words.meta.substitutions.capitalisation,
              measures.words.meta.substitutions.compoundWords,
              measures.words.meta.substitutions.prefixes,
              measures.words.meta.substitutions.suffixes,
              measures.words.meta.substitutions.stemmers,
              measures.words.meta.substitutions.homophones,
              measures.words.meta.substitutions.numbers,
              measures.words.meta.substitutions.unspecified,
            ],
            backgroundColor: Object.values(this.displayService.colors),
          },
        ];
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
