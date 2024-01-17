import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import {
  Operation,
  RouteElement,
  SubstitutionName,
  getStemmer,
} from '../../../../lib';
import { DisplayService } from '../../../services/display.service';

@Component({
  selector: 'app-route-element',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatMenuModule],
  templateUrl: './route-element.component.html',
  styleUrl: './route-element.component.scss',
})
export class RouteElementComponent implements OnInit, OnDestroy {
  @Input() element!: RouteElement;
  @Input() prev!: RouteElement | null;
  @Input() next!: RouteElement | null;

  private destroy$$ = new Subject<void>();

  public before!: SafeHtml;
  public after!: SafeHtml;
  public tooltip: boolean = false;
  public parts: Array<{ text: string; cssClass: string }> = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private displayService: DisplayService
  ) {}

  ngOnInit() {
    this.displayService.selectedDisplayOptions$
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        this.update();
      });
    this.update();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }

  getTooltipText(): string {
    const lines: string[] = [];
    switch (this.element.op) {
      case Operation.OK: {
        lines.push('Normalisations');
        if (this.element.ref.normalisations.length) {
          lines.push(
            `Ref: ${this.element.ref.normalisations.join(',')} (${
              this.element.ref.rawValue
            } -> ${this.element.ref.value})`
          );
        }
        if (this.element.hyp.normalisations.length) {
          lines.push(
            `Hyp: ${this.element.hyp.normalisations.join(',')} (${
              this.element.hyp.rawValue
            } -> ${this.element.hyp.value})`
          );
        }
        break;
      }
      case Operation.SUB: {
        lines.push(
          `${this.element.name}`,
          `Ref: ${this.element.ref.value}`,
          `Hyp: ${this.element.hyp.value}`
        );
      }
    }

    return lines.join('\n');
  }

  update() {
    this.parts = [];
    let before: string = '';
    let after: string = '';

    switch (this.element.op) {
      case Operation.OK: {
        before = this.element.hyp.before;
        after = this.element.hyp.after;

        let cssClass = 'ok';
        if (
          this.element.hyp.normalisations.length ||
          this.element.ref.normalisations.length
        ) {
          this.tooltip = true;
          if (this.displayService.isOptionSelected('normalisations')) {
            cssClass = 'ok normalisation';
          }
        }
        this.parts.push({
          text: this.element.hyp.value,
          cssClass,
        });
        break;
      }
      case Operation.DEL: {
        before = this.element.ref.before;
        after = this.element.ref.after;
        this.parts.push({
          text: this.element.ref.value,
          cssClass: 'ins', // For visualisation this is an addition to the hypothesis
        });
        break;
      }
      case Operation.INS: {
        before = this.element.hyp.before;
        after = this.element.hyp.after;
        this.parts.push({
          text: this.element.hyp.value,
          cssClass: 'del', // For visualisation this is an deletion of the hypothesis
        });
        break;
      }
      case Operation.SUB: {
        before = this.element.ref.before;
        after = this.element.ref.after;
        this.tooltip = true;
        switch (this.element.name) {
          case SubstitutionName.COMPOUND_WORD: {
            const cssClass = this.displayService.isOptionSelected(
              'compoundwords'
            )
              ? 'sub compound-word'
              : 'ok';
            this.parts.push({
              text: this.element.hyp.value,
              cssClass,
            });
            break;
          }
          case SubstitutionName.CAPITALISATION: {
            const cssClass = this.displayService.isOptionSelected(
              'capitalisation'
            )
              ? 'sub capitalisation'
              : 'ok';
            for (let i = 0; i < this.element.ref.value.length; i++) {
              const ref = this.element.ref.value[i];
              const hyp = this.element.hyp.value[i];
              this.parts.push({
                text: ref,
                cssClass: ref !== hyp ? cssClass : 'ok',
              });
            }
            break;
          }
          case SubstitutionName.HOMOPHONE: {
            const cssClass = this.displayService.isOptionSelected('homophones')
              ? 'sub homophone'
              : 'ok';
            this.parts.push({
              text: this.element.hyp.value,
              cssClass,
            });
            break;
          }
          case SubstitutionName.STEMMER: {
            const cssClass = this.displayService.isOptionSelected('stemmers')
              ? 'sub stemmer'
              : 'ok';
            const stemmer = getStemmer(this.element.hyp.value);
            const text =
              this.element.hyp.value.length > this.element.ref.value.length
                ? this.element.hyp.value
                : this.element.ref.value;

            for (let i = 0; i < text.length; i++) {
              this.parts.push({
                text: text[i],
                cssClass: i < stemmer.length ? cssClass : `${cssClass} suffix`,
              });
            }
            break;
          }
          default:
            this.parts.push({
              text: this.element.ref.value,
              cssClass: 'sub full',
            });
            break;
        }
        break;
      }
    }

    if (before !== '') {
      this.before = this.domSanitizer.bypassSecurityTrustHtml(
        before.replaceAll('\n', '<br>')
      );
    }

    if (after !== '') {
      this.after = this.domSanitizer.bypassSecurityTrustHtml(
        after.replaceAll('\n', '<br>')
      );
    }
  }
}
