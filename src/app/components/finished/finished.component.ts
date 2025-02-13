import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-finished',
  imports: [
    CommonModule
  ],
  templateUrl: './finished.component.html',
  styleUrl: './finished.component.scss'
})
export class FinishedComponent {

  public finished$: Observable<boolean>;
  
  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore
  ) {
    this.finished$ = this.macroDataRefinementStore.finished$;
  }
}
