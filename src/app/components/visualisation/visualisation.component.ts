import { Component } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { AppService } from '../../services/app.service';
import { RouteElementComponent } from './route-element/route-element.component';

@Component({
  selector: 'app-visualisation',
  standalone: true,
  imports: [RouteElementComponent, LetDirective],
  templateUrl: './visualisation.component.html',
  styleUrl: './visualisation.component.scss',
})
export class VisualisationComponent {
  public route$ = this.appService.route$;

  constructor(private appService: AppService) {}
}
