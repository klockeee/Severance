import { Bins, IMacroDataRefinementState } from '../data/interfaces/mdr.state.interface';
import { StoreStatus } from './enums/store-status.enum';
import { IBin } from './interfaces/bin.interface';
import { IData } from './interfaces/data.interface';

const files = [
    'Siena',
    'Nanning',
    'Narva',
    'Ocula',
    'Kingsport',
    'Labrador',
    'Le Mars',
    'Longbranch',
    'Moonbeam',
    'Minsk',
    'Dranesville',
]

export class MacroDataRefinementState implements IMacroDataRefinementState {
    name = files.at(Math.floor(Math.random() * (files.length)))!;
    progress = 0;
    macroData = new Array<IData[]>();
    bins: Bins = [];
    status: StoreStatus;
    
    constructor() {
        this.status = StoreStatus.Init;
    }
}