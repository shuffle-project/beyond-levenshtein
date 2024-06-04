import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LetDirective } from '@ngrx/component';
import { Observable, Subject, combineLatest, map } from 'rxjs';
import { calculateWER } from '../../../../lib/wer';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-error-rate',
  standalone: true,
  imports: [MatCardModule, CommonModule, LetDirective],
  templateUrl: './error-rate.component.html',
  styleUrl: './error-rate.component.scss',
})
export class ErrorRateComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public measures$: Observable<
    Array<{
      title: string;
      errorRate: number;
      subtitle?: string;
      f1?: number;
      wer?: number;
    }>
  > = combineLatest([
    this.appService.measures$,
    this.appService.textChanged$,
  ]).pipe(
    map(([measures, text]) => {
      return [
        {
          title: 'Words',
          errorRate: measures.metrics.wer,
          wer: calculateWER(text.groundTruth, text.hypothesis, false, false),
        },
        {
          title: 'Punctuation',
          errorRate: measures.metrics.punctuation.errorRate,
          f1: measures.metrics.punctuation.f1Score,
          wer: calculateWER(text.groundTruth, text.hypothesis, false, true),
        },
        {
          title: 'Capitalisation',
          errorRate: measures.metrics.capitalisation.errorRate,
          f1: measures.metrics.capitalisation.f1Score,
          wer: calculateWER(text.groundTruth, text.hypothesis, true, false),
        },
        {
          title: 'Numbers',
          errorRate: measures.metrics.numbers.errorRate,
          f1: measures.metrics.numbers.f1Score,
        },
      ];
    })
  );

  constructor(private appService: AppService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
