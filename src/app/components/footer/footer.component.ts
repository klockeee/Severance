import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { Observable } from 'rxjs';
import { Bins } from '../../data/interfaces/mdr.state.interface';
import { BinStatus } from '../../data/enums/bin-status.enum';
import { KierTempersColors } from '../../data/enums/system-colors.enum';
import { IBin } from '../../data/interfaces/bin.interface';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  public bins$: Observable<Bins>;

  public status = BinStatus;
  public kierPrinciples = KierTempersColors;

  public getProp = (bin: IBin, prop: string) => (bin as any)[prop.toLowerCase()]; // :D

  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore
  ) {
    this.bins$ = this.macroDataRefinementStore.bins$;
  }
}
