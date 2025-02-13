import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Injector, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DataComponent } from '../data/data.component';
import { IData } from '../../data/interfaces/data.interface';
import { MacroDataRefinementStore } from '../../stores/mdr.store';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrl: './selection-box.component.scss',
  imports: [
    CommonModule
  ]
})
export class SelectionBoxComponent {

  @ViewChild('selectionBox') selectionBox!: ElementRef;
  @Output() selecteds = new EventEmitter<IData[]>();

  private nope$: Observable<boolean>;

  startX = 0;
  startY = 0;
  left = 0;
  top = 0;
  width = 0;
  height = 0;
  isSelecting = false;

  constructor(private macroDataRefinementStore: MacroDataRefinementStore) {
    this.nope$ = this.macroDataRefinementStore.nope$;
  }

  @HostListener('window:mousedown', ['$event'])
  async onMouseDown(event: MouseEvent) {
    if(await firstValueFrom(this.nope$))
      return;
    
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.isSelecting = true;
    this.updateBox(event.clientX, event.clientY);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isSelecting) return;
    this.updateBox(event.clientX, event.clientY);
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isSelecting = false;
    this.selecteds.emit(this.detectSelectedItems());
  }

  private updateBox(currentX: number, currentY: number) {
    this.width = Math.abs(currentX - this.startX);
    this.height = Math.abs(currentY - this.startY);
    this.left = Math.min(this.startX, currentX);
    this.top = Math.min(this.startY, currentY);
  }

  private detectSelectedItems() {
    const selectionRect = {
        left: this.left,
        top: this.top,
        right: this.left + this.width,
        bottom: this.top + this.height
    };
    
    const elements = Array.from(document.querySelectorAll('app-data')) as HTMLElement[];
    
    const inArea = elements.map(el => {
        const rect = el.getBoundingClientRect();
        const isInside = (
            rect.left < selectionRect.right &&
            rect.right > selectionRect.left &&
            rect.top < selectionRect.bottom &&
            rect.bottom > selectionRect.top
        );
        if (isInside) {
            return this.getDataFromComponentInstance(el);
        }
        return null;
    }).filter(comp => comp !== null);

    return inArea;
  }
  
  private getDataFromComponentInstance(element: HTMLElement): IData | null {
    const component = (window as any).ng.getComponent(element);
    return component instanceof DataComponent ? component.data : null;
  }

}
