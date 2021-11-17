import { IIndividualRecordModel } from '@ancestable/shared';

interface PedigreePersonEntry {
  individualRecord: IIndividualRecordModel | null;
  parentPedigreeCouple: PedigreeCouple | null;
}

export interface PedigreeCouple {
  mother: PedigreePersonEntry;
  father: PedigreePersonEntry;
}
