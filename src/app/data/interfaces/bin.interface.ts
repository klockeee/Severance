import { BinStatus } from "../enums/bin-status.enum";
import { KierTempersColors } from "../enums/system-colors.enum";

export interface IBin {
    id: number;
    progress: number;
    wo: number;
    fc: number;
    dr: number;
    ma: number;
    status: BinStatus;

    open: () => void;
    close: () => void;
    add: (amount: number) => void;
}