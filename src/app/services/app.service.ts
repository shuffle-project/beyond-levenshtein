import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Measures, Options, Route, process } from '../../lib';
import { DisplayService } from './display.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public textChanged$ = new Subject<{
    groundTruth: string;
    hypothesis: string;
  }>();
  public route$ = new Subject<Route>();
  public measures$ = new Subject<Measures>();

  constructor(private displayService: DisplayService) {}

  update(groundTruth: string, hypothesis: string, normalisations: string[]) {
    const options: Options = Object.fromEntries(
      this.displayService.normalisationOptions.map((o) => [
        o,
        normalisations.includes(o),
      ])
    ) as any;

    const { measures, route } = process(groundTruth, hypothesis, options);

    this.route$.next(route);
    this.measures$.next(measures);
    this.textChanged$.next({ groundTruth, hypothesis });
  }
}
