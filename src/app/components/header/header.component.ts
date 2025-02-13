import { Component } from '@angular/core';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  public name$: Observable<string>;
  public progress$: Observable<number>;

  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore
  ) {
    this.name$ = this.macroDataRefinementStore.name$;
    this.progress$ = this.macroDataRefinementStore.progress$;
  }
}
