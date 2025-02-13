import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap, withLatestFrom } from 'rxjs';
import { MacroDataRefinementState } from '../data/mdr.state';
import { Bins, MacroData } from '../data/interfaces/mdr.state.interface';
import { IData } from '../data/interfaces/data.interface';
import { IBin } from '../data/interfaces/bin.interface';
import { StoreStatus } from '../data/enums/store-status.enum';
import { BinStatus } from '../data/enums/bin-status.enum';
import { KierTempersColors } from '../data/enums/system-colors.enum';

@Injectable()
export class MacroDataRefinementStore extends ComponentStore<MacroDataRefinementState> {

  constructor() {
    super(new MacroDataRefinementState());
  }

  public readonly macroData$: Observable<MacroData> = this.select(
    (state) => state.macroData
  );

  public readonly bins$: Observable<Bins> = this.select(
    (state) => state.bins
  );

  public readonly progress$: Observable<number> = this.select(
    (state) => state.progress
  );

  public readonly name$: Observable<string> = this.select(
    (state) => state.name
  );

  public readonly status$: Observable<StoreStatus> = this.select(
    (state) => state.status
  );

  public readonly nope$: Observable<boolean> = this.select(
    (state) => state.status === StoreStatus.Nope
  );
  public readonly finished$: Observable<boolean> = this.select(
    (state) => state.status === StoreStatus.Finished
  );

  public readonly updateMacroData = this.updater(
    (state, macroData: MacroData) => {
      return {
        ...state,
        macroData: macroData
      };
    }
  );

  public readonly updateBins = this.updater(
    (state, bins: Bins) => {
      return {
        ...state,
        bins: bins
      };
    }
  );
  
  public readonly updateName = this.updater(
    (state, name: string) => {
      return {
        ...state,
        name: name
      };
    }
  );

  public readonly updateProgress = this.updater(
    (state, progress: number) => {
      return {
        ...state,
        progress: progress
      };
    }
  );

  public readonly updateStatus = this.updater(
    (state, status: StoreStatus) => {
      return {
        ...state,
        status: status
      };
    }
  );

  readonly initialize = this.effect((size$: Observable<number>) => {
    return size$.pipe(
      tap((size) => {
        this.generateMacroData(size);
        this.generateBins();
        this.generateDangerousData();
        this.updateStatus(StoreStatus.Waiting);
      })
    )
  });

  readonly refreshProgress = this.effect(($: Observable<void>) => {
    return $.pipe(
      withLatestFrom(this.progress$, this.bins$),
      tap(async ([,progress, bins]) => {

        const newProgress = Math.floor(bins.reduce((a,b) => a + b.progress, 0) / bins.length);
        const difference = newProgress - progress;

        for (let index = 0; index < difference; index++) {
          await delay(100).then(() => progress += 1);
        }

        this.updateProgress(progress);
      })
    )
  });

  readonly setAfraid = this.effect((data$: Observable<IData>) => {
    return data$.pipe(
      withLatestFrom(this.macroData$),
      tap(([data, macroData]) => {

        let row = 0;
        let col = 0;

        for (let r = 0; r < macroData.length; r++) {
          const c = macroData[r].indexOf(data);
          if (c !== -1) {
            [row, col] =  [r, c];
          }
        }
        
        const radius = 2;

        const neighbors = [data];

        const lines = macroData.length;
        const cols = macroData[0].length;

        for (let i = row - radius; i <= row + radius; i++) {
          for (let j = col - radius; j <= col + radius; j++) {
              // Verificar se a posição está dentro dos limites da matriz
              if (
                  i >= 0 &&
                  i < macroData.length &&
                  j >= 0 &&
                  j < macroData[0].length
              ) {
                  // Calcular a distância euclidiana ao quadrado
                  const distanceSquared =
                      (i - row) ** 2 + (j - col) ** 2;
  
                  // Verificar se o item está dentro do raio (círculo)
                  if (distanceSquared <= radius ** 2) {
                      neighbors.push(macroData[i][j]);
                  }
              }
          }
      }
      
      macroData.forEach(datas => datas.forEach(data => data.afraid = false));
      neighbors.forEach(neighbour => neighbour.afraid = true);
    }))
  });

  readonly generateMacroData = this.effect((size$: Observable<number>) => {
    return size$.pipe(
      tap((size) => {
        this.updateMacroData(generateMacroData(size));
      })
    )
  });

  readonly generateBins = this.effect(($: Observable<void>) => {
    return $.pipe(
      tap(() => {
        this.updateBins([
          generateBin(1),
          generateBin(2),
          generateBin(3),
          generateBin(4),
          generateBin(5)
        ]); // Como são numeros fixos, será hard-coded, porém é mais para mostrar o exemplo de como pode ser utilizado em store
      })
    )
  });

  readonly generateDangerousData = this.effect(($: Observable<void>) => {
    return $.pipe(
      withLatestFrom(this.macroData$),
      tap(([,storedMacroData]) => {
        this.updateMacroData(generateDangerousData(storedMacroData, 20, 1));
      })
    )
  });

  readonly check = this.effect((datas$: Observable<IData[]>) => {
    return datas$.pipe(
      tap((datas) => {

        const dangerous = datas.filter(data => data.dangerous);
        const innocents = datas.filter(data => !data.dangerous);
        const hasInnocents = !!innocents.length;

        const nope = hasInnocents && innocents.length > dangerous.length;

        if(nope) {
          this.updateStatus(StoreStatus.Nope);
          return
        }
        this.refine(dangerous);
      })
    )
  });

  readonly refine = this.effect((toRefine$: Observable<IData[]>) => {
    return toRefine$.pipe(
      withLatestFrom(this.bins$, this.macroData$),
      tap(async ([toRefine, bins, macroData]) => {

        if(bins.every(bin => bin.progress === 100)) {
          this.updateStatus(StoreStatus.Finished);
          return;
        }

        this.updateStatus(StoreStatus.Refining);

        const notFull = bins.filter(x => x.progress !== 100);
        const bin = notFull.at(Math.random()*notFull.length)! // Não sei como funciona a lógica na série, então botei aleatório
        bin.open();

        toRefine.forEach(data => data.refine(bin));

        await delay(5000).then(() => this.processData({amount: toRefine.length, bin: bin}));

        const ids = toRefine.map(data => data.id);

        const filtered: MacroData = macroData.map(row => row.filter(data => !ids.includes(data.id)));

        this.updateMacroData(filtered);
        this.updateStatus(StoreStatus.Waiting);
      })
    )
  });

  readonly processData = this.effect((information$: Observable<{amount: number, bin: IBin}>) => {
    return information$.pipe(
      tap((information) => {
        const bin = information.bin;
        const amount = information.amount;
        
        bin.add(100);

        setTimeout(() => {
          bin.close();
          this.refreshProgress();
        }, 2000);
      })
    )
  });
}

const generateId = () => Math.floor(Math.random() * 999999999);

const generateMacroData = (size: number) => {
    const macroData = [];
    // preencher colunas
    for (let col = 0; col < size; col++) {
        const row = [];
        // preencher linhas
        for (let i = 0; i < size; i++) {
            row.push(generateData());
        }
        macroData.push(row);
    }

    return macroData;
}

const generateBin = (id: number) => {
  const bin = {
    id: id,
    progress: 0,
    dr: 0,
    fc: 0,
    ma: 0,
    wo: 0,
    status: BinStatus.Standby
  } as IBin;

  bin.open = () => {
    bin.status = BinStatus.Opening
    setTimeout(() => bin.status = BinStatus.Opened, 2000);
  };
  bin.close = () => bin.status = BinStatus.Closing;
  bin.add = async (amount) => {

    Object.keys(KierTempersColors).map(principle => principle.toLowerCase()).every(principle => {
      const sum = (bin as any)[principle] + amount;

      if((bin as any)[principle] === 100) {
        return true
      }

      if(sum <= 100) {
        (bin as any)[principle] += amount;
        return false;
      }
      
      return true;
    });

    const newProgress = Math.floor((bin.dr + bin.fc + bin.ma + bin.wo) / Object.keys(KierTempersColors).length);
    const difference = newProgress - bin.progress;

    for (let index = 0; index < difference; index++) {
      await delay(100 - index).then(() => {
        if(bin.progress + 1 >= 100)
          bin.progress = 100;
        else
          bin.progress += 1
      });
    }
  }

  return bin;
}

const generateData = () => {
  const randomInt = Math.floor(Math.random() * 10);
  return {
    id: generateId(),
    value: randomInt,
    dangerous: false
  } as IData
}

const generateDangerousData = (
    macroData: MacroData,
    numZones: number,
    spreadSize: number
  ) => {
    const rows = macroData.length;
    const cols = macroData[0].length;

    macroData.reduce((a,b) => a.concat(b)).forEach(data => data.dangerous = false);
  
    for (let i = 0; i < numZones; i++) {

      const startRow = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * cols);
  
      for (let r = -spreadSize; r <= spreadSize; r++) {
        for (let c = -spreadSize; c <= spreadSize; c++) {
          const newRow = startRow + r;
          const newCol = startCol + c;
  
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const data = macroData[newRow][newCol];
            data.dangerous = true;
          }
        }
      }
    }
  
    return macroData;
}

const delay = (delayInms: number) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};