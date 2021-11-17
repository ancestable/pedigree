import { Sex } from '@ancestable/gedcom7models';
import { IIndividualRecordModel } from '@ancestable/shared';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit {

  @Input() individualRecord: IIndividualRecordModel | undefined | null = undefined;

  constructor() { }

  ngOnInit(): void {
  }

  genderStyle(individualRecord: IIndividualRecordModel) {
    switch (individualRecord.SEX) {
      case Sex.Male: return 'male-background';
      case Sex.Female: return 'female-background';
      case Sex.Divers: return 'divers-background';
      default: return 'unknown-background';
    }
  }

  get givenName(): string {
    const unkownString = '...'
    if (!this.individualRecord?.personalNameStructures?.length) {
      return unkownString;
    }

    return this.individualRecord?.personalNameStructures[0]?.NAME?.personalNamePieces?.GIVN?.join(' ') || unkownString;
  }

  get surName(): string {
    const unkownString = '...'
    if (!this.individualRecord?.personalNameStructures?.length) {
      return unkownString;
    }

    return this.individualRecord?.personalNameStructures[0]?.NAME?.personalNamePieces?.SURN?.join(' ') || unkownString;
  }
}
