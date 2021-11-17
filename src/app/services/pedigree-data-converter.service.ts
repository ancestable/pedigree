import { IDatasetModelWithRecords, IIndividualRecordModel } from '@ancestable/shared';
import { Injectable } from '@angular/core';
import { PedigreeCouple } from '../models/pedigreeCouple';

@Injectable({
  providedIn: 'root'
})
export class PedigreeDataConverterService {

  convertDatasetToPedigree(dataset: IDatasetModelWithRecords, customStartingPersonId?: string): PedigreeCouple | null {
    const startingPerson = customStartingPersonId
      ? this.getIndividualRecordByID(customStartingPersonId, dataset)
      : dataset.individualRecords[0];

    if (!startingPerson) {
      return null;
    }

    return this.createPedigreeCoupleForChild(dataset, startingPerson);
  }

  private getIndividualRecordByID(individualRecordId: string, dataset: IDatasetModelWithRecords): IIndividualRecordModel | undefined {
    return dataset.individualRecords.find((individualRecord) => individualRecord.referenceId === individualRecordId);
  }

  private createPedigreeCoupleForChild(dataset: IDatasetModelWithRecords, individualRecord?: IIndividualRecordModel) {
    const familyRecord = dataset.familyRecords.find((familyRecord) => {
      return familyRecord.CHIL?.find((childrenPointer) => childrenPointer.reference === individualRecord?.referenceId);
    });

    const mother = familyRecord?.WIFE?.reference ? this.getIndividualRecordByID(familyRecord?.WIFE?.reference, dataset) : null;
    const father = familyRecord?.HUSB?.reference ? this.getIndividualRecordByID(familyRecord?.HUSB?.reference, dataset) : null;

    const pedigreePerson: PedigreeCouple = {
      mother: {
        individualRecord: mother || null,
        parentPedigreeCouple: mother ? this.createPedigreeCoupleForChild(dataset, mother) : null,
      },
      father: {
        individualRecord: mother || null,
        parentPedigreeCouple: father ? this.createPedigreeCoupleForChild(dataset, father) : null,
      },
    }

    return pedigreePerson;
  }

}
