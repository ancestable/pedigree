import { IndividualRecord } from '@ancestable/gedcom7models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-couple',
  templateUrl: './couple.component.html',
  styleUrls: ['./couple.component.scss']
})
export class CoupleComponent implements OnInit {

  @Input() motherIndividualRecord: IndividualRecord | undefined | null = undefined;
  @Input() fatherIndividualRecord: IndividualRecord | undefined | null = undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
