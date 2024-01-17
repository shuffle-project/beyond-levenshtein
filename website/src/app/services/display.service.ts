import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_OPTIONS } from '../../lib/options';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  public colors = {
    red: '#ef5350',
    pink: '#ec407a',
    purple: '#ab47bc',
    deepPurple: '#7e57c2',
    indigo: '#5c6bc0',
    blue: '#42a5f5',
    lightBlue: '#29b6f6',
    cyan: '#26c6da',
    teal: '#26a69a',
    green: '#66bb6a',
    lightGreen: '#9ccc65',
    lime: '#c0ca33',
    yellow: '#fdd835',
    amber: '#ffca28',
    orange: '#ffa726',
    deepOrange: '#ff7043',
  };

  public normalisationOptions = Object.keys(DEFAULT_OPTIONS);
  public selectedNormalisationOptions$ = new BehaviorSubject<string[]>(
    Object.entries(DEFAULT_OPTIONS)
      .filter((o) => o[1])
      .map((o) => o[0])
  );

  public displayOptions = [
    'Capitalisation',
    'CompoundWords',
    'Homophones',
    'Normalisations',
    'Prefixes',
    'Stemmers',
    'Suffixes',
  ];
  public selectedDisplayOptions$ = new BehaviorSubject<string[]>([
    ...this.displayOptions,
  ]);

  constructor() {}

  public setOptions(options: string[]) {
    this.selectedDisplayOptions$.next(options);
  }

  public isOptionSelected(value: string): boolean {
    return this.selectedDisplayOptions$
      .getValue()
      .some((o) => o.toLowerCase() === value);
  }
}
