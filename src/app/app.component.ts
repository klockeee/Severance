import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SystemColors } from './data/enums/system-colors.enum';
import { ColorService } from './features/color.service';
import { MacroDataRefinementStore } from './stores/mdr.store';
import { MacroDataFieldComponent } from './components/macro-data-field/macro-data-field.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MacroDataFieldComponent,
    FooterComponent
  ],
  providers: [
    MacroDataRefinementStore,
    ColorService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private _columns = 0;

  public get columns() {
    return this._columns;
  }
  public set columns(v : number) {
    this._columns = Math.floor((innerWidth-30)/75);
  }
  
  public systemColors = SystemColors;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.columns = window.innerWidth;
    this.ngOnInit();
  }

  constructor(
    private macroDataRefinementStore: MacroDataRefinementStore,
    private colorService: ColorService
  ) {
    this.columns = window.innerWidth;
  }

  ngOnInit(): void {
    this.colorService.setCSSVariables();
    this.macroDataRefinementStore.initialize(this.columns); // 75 = tamanho do data;
  }
}
