import { Injectable } from '@angular/core';
import { SystemColors } from '../data/enums/system-colors.enum';

@Injectable()
export class ColorService {
    public setCSSVariables(): void {
        document.documentElement.style.setProperty(
            '--primary-color',
            SystemColors.Primary
        );
        document.documentElement.style.setProperty(
            '--secondary-color',
            SystemColors.Secondary
        );
        document.documentElement.style.setProperty(
            '--background',
            SystemColors.Background
        );
    }
}
