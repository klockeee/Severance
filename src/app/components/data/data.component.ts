import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IData } from '../../data/interfaces/data.interface';
import { IBin } from '../../data/interfaces/bin.interface';

@Component({
  selector: 'app-data',
  imports: [
    CommonModule
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent implements OnInit {
  @Input({ required: true }) data!: IData; 

  @ViewChild('dataContainer') dataContainer!: ElementRef;
  @ViewChild('dataSpan') dataSpan!: ElementRef;

  constructor(
    private host: ElementRef<HTMLElement>
  ){}

  public randomX: number = generateRandomValue(-300, 300);
  public randomY: number = generateRandomValue(-300, 300);
  public randomSize: number = generateRandomValue(32, 42);
  public randomDuration: number = generateRandomValue(3, 8);
  public randomShake: Array<number[]> = generateRandomShake();

  ngOnInit(): void {
    this.data.refine = (bin: IBin) => {
      const element = this.dataSpan.nativeElement;
      const rect = element.getBoundingClientRect();

      element.style.position = 'absolute';
      element.style.left = `${rect.left}px`;
      element.style.top = `${rect.top}px`;
      element.style.right = `${rect.right}px`;
      element.style.bottom = `${rect.bottom}px`;
      element.style.fontSize = `${this.randomSize}px`;
      element.style.transition =  'inset 5s ease, opacity 4s ease';

      document.documentElement.appendChild(element);

      const binRect = document.getElementById(`bin-${bin.id}`)!.getBoundingClientRect();

      setTimeout(() => {
        this.dataSpan.nativeElement.style.left = `${binRect.left - 37.5}px`;
        this.dataSpan.nativeElement.style.top = `${binRect.top- 37.5}px`;
        element.style.opacity = `0`;
        
        setTimeout(() => {
          this.dataSpan.nativeElement.remove();
        }, 5000);
      }, 200);
    }
  }
}

const generateRandomValue = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const generateRandomShake = () => {
  let randomShake = [];
  for (let index = 0; index < 4; index++) {
    randomShake?.push([generateRandomValue(-4, 4), generateRandomValue(4, -4)]);
  }

  return randomShake;
}