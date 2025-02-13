import { StoreStatus } from "../enums/store-status.enum";
import { IBin } from "./bin.interface";
import { IData } from "./data.interface";

export type MacroData = Array<IData[]>;
export type Bins = IBin[];

export interface IMacroDataRefinementState {
    name: string;
    progress: number;
    macroData: MacroData;
    bins: Bins;
    status: StoreStatus;
}