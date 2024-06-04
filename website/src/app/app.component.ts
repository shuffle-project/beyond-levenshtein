import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ErrorRateComponent } from '@src/app/components/analysis/error-rate/error-rate.component';
import { WordErrorsComponent } from '@src/app/components/analysis/word-errors/word-errors.component';
import { VisualisationComponent } from '@src/app/components/visualisation/visualisation.component';
import { Subject, debounceTime, takeUntil, tap } from 'rxjs';

import { NormalisationsComponent } from '@src/app/components/analysis/normalisations/normalisations.component';
import { WordSubstitutionsComponent } from '@src/app/components/analysis/word-substitutions/word-substitutions.component';
import {
  EXAMPLE_GROUND_TRUTH,
  EXAMPLE_HYPOTHESIS,
} from '@src/app/constants/example-text.constant';
import { DATASET_EXAMPLES } from '@src/app/constants/examples';
import { AppService } from '@src/app/services/app.service';
import { DisplayService } from '@src/app/services/display.service';

interface Example {
  id: string;
  dataset: string;
  hypothesis: string;
  groundTruth: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    VisualisationComponent,
    MatCardModule,
    WordErrorsComponent,
    ErrorRateComponent,
    MatProgressSpinnerModule,
    NormalisationsComponent,
    MatSelectModule,
    WordSubstitutionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();

  public loading = true;

  public formGroup = this.fb.group({
    groundTruth: this.fb.control<string>('', { nonNullable: true }),
    hypothesis: this.fb.control<string>('', { nonNullable: true }),
    normalisations: this.fb.control<string[]>(
      [...this.displayService.selectedNormalisationOptions$.getValue()],
      { nonNullable: true }
    ),
  });
  public normalisationOptions = [...this.displayService.normalisationOptions];

  public examples: Example[] = [
    {
      id: 'Welcome',
      dataset: 'test',
      groundTruth: EXAMPLE_GROUND_TRUTH,
      hypothesis: EXAMPLE_HYPOTHESIS,
    },
    ...DATASET_EXAMPLES,
  ];
  public exampleSelect = this.fb.control<Example>(this.examples[0]!, {
    nonNullable: true,
  });

  public displayOptions = this.displayService.displayOptions;
  public displayOptionsControl = this.fb.control(
    [...this.displayService.selectedDisplayOptions$.getValue()],
    { nonNullable: true }
  );

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private displayService: DisplayService
  ) {}

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$$),
        tap(() => (this.loading = true)),
        debounceTime(500)
      )
      .subscribe(({ groundTruth, hypothesis, normalisations }) => {
        this.appService.update(groundTruth!, hypothesis!, normalisations!);
        this.loading = false;
      });

    this.exampleSelect.valueChanges
      .pipe(takeUntil(this.destroy$$))
      .subscribe((example) => {
        this.formGroup.get('groundTruth')?.setValue(example.groundTruth);
        this.formGroup.get('hypothesis')?.setValue(example.hypothesis);
      });

    this.displayOptionsControl.valueChanges
      .pipe(takeUntil(this.destroy$$))
      .subscribe((options) => {
        this.displayService.setOptions(options);
      });

    this.exampleSelect.setValue(this.examples[0]);

    this.formGroup
      .get('groundTruth')
      ?.setValue(this.exampleSelect.value.groundTruth);
    this.formGroup
      .get('hypothesis')
      ?.setValue(this.exampleSelect.value.hypothesis);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
}
