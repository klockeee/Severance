import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MacroData } from '../../data/interfaces/mdr.state.interface';
import { DataComponent } from '../data/data.component';
import { IData } from '../../data/interfaces/data.interface';
import { SelectionBoxComponent } from '../selection-box/selection-box.component';
import { NopeComponent } from '../nope/nope.component';
import { FinishedComponent } from '../finished/finished.component';

@Component({
  selector: 'app-macro-data-field',
  imports: [
    CommonModule,
    DataComponent,
    SelectionBoxComponent,
    NopeComponent,
    FinishedComponent
  ],
  templateUrl: './macro-data-field.component.html',
  styleUrl: './macro-data-field.component.scss'
})
export class MacroDataFieldComponent {
  @ViewChildren('data') dataComponents!: QueryList<DataComponent>;

  public macroData$: Observable<MacroData>;
  public block$: Observable<boolean>;

  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore
  ) {
    this.macroData$ = this.macroDataRefinementStore.macroData$;
    this.block$ = combineLatest([this.macroDataRefinementStore.nope$, this.macroDataRefinementStore.finished$]).pipe(map(([a,b]) => a || b));
  }

  public setAfraid(data: IData) {
    this.macroDataRefinementStore.setAfraid(data);
  }
  
  public check(datas: IData[]){
    this.macroDataRefinementStore.check(datas);
  }
}
