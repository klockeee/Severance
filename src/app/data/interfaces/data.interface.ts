import { IBin } from "./bin.interface";

export interface IData {
    id: number;
    value: number;
    afraid: boolean;
    dangerous: boolean;

    refine: (bin: IBin) => void
}