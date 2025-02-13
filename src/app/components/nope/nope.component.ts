import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { map, Observable } from 'rxjs';
import { StoreStatus } from '../../data/enums/store-status.enum';

@Component({
  selector: 'app-nope',
  imports: [
    CommonModule
  ],
  templateUrl: './nope.component.html',
  styleUrl: './nope.component.scss'
})
export class NopeComponent {

  public nope$: Observable<boolean>;
  
  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore
  ) {
    this.nope$ = this.macroDataRefinementStore.nope$;

    this.nope$.subscribe(nope => {
      if(nope)
        setTimeout(() => this.macroDataRefinementStore.updateStatus(StoreStatus.Waiting), 2000);
    })
  }
}
