import { IndividualRecord, Sex } from '@ancestable/gedcom7models';
import { IDatasetModelWithRecords, WindowObservable } from '@ancestable/shared';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { PedigreeCouple } from 'src/app/models/pedigreeCouple';
import { PedigreeDataConverterService } from 'src/app/services/pedigree-data-converter.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, AfterViewInit {
  @Input() levelDepth = 4;
  @Input() selectedPedigreeRootIndividualId = '@I1@';

  @ViewChild('container') elementView!: ElementRef;

  dataset: IDatasetModelWithRecords | null | undefined = null;
  pedigree: PedigreeCouple | null = null;
  panX: number = 0;
  panY: number = 0;
  panXCurrentMove: number = 0;
  panYCurrentMove: number = 0;
  mouseDownStartX: number = 0;
  mouseDownStartY: number = 0;

  containerHeight: number = 0;
  containerWidth: number = 0;

  scaleFactor: number = 1;

  SEX = Sex;

  private isMouseDown = false;
  private LEVEL_WIDTH = 400;
  private COUPLE_ITEM_HEIGHT = 112;

  constructor(
    private pedigreeDataConverter: PedigreeDataConverterService,
  ) { }

  ngOnInit(): void {
    this.dataset = WindowObservable.DatasetWithRecords.getLastEvent();
    this.pedigree = this.dataset ? this.pedigreeDataConverter.convertDatasetToPedigree(this.dataset, this.selectedPedigreeRootIndividualId) : null;

    WindowObservable.DatasetWithRecords.subscribe((dataset) => {
      this.dataset = dataset;
      this.pedigree = this.dataset ? this.pedigreeDataConverter.convertDatasetToPedigree(this.dataset, this.selectedPedigreeRootIndividualId) : null;
    });
  }

  ngAfterViewInit(): void {
    this.setTransform();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setTransform();
  }

  pan(e: MouseEvent) {
    if (this.isMouseDown) {
      e.stopPropagation();
      this.panXCurrentMove = e.clientX - this.mouseDownStartX;
      this.panYCurrentMove = e.clientY - this.mouseDownStartY;
      console.log(e.clientX - this.mouseDownStartX);
      console.log(e.clientY - this.mouseDownStartY);
    }
  }

  mouseDown(e: MouseEvent) {
    this.isMouseDown = true;
    this.mouseDownStartX = e.clientX;
    this.mouseDownStartY = e.clientY;
  }

  mouseUp(e: MouseEvent) {
    this.isMouseDown = false;
    this.panX += this.panXCurrentMove;
    this.panY += this.panYCurrentMove;
    this.mouseDownStartX = 0;
    this.mouseDownStartY = 0;
    this.panXCurrentMove = 0;
    this.panYCurrentMove = 0;
  }

  transform() {
    return `translate(${this.panX + this.panXCurrentMove}px, ${(this.panY + this.panYCurrentMove - this.heightOfPedigreeChart) * 1.1 * this.scaleFactor}px) scale(${this.scaleFactor})`;
  }

  itemNumberArray(level: number): number[] {
    return Array(2**level).fill(1).map((x,i)=>i);
  }

  top(currentLevel: number, itemNumber: number) {
    return `${this.totalOffset(currentLevel, itemNumber) - this.totalOffset(0, 0)}px`;
  }

  lineTop(currentLevel: number, itemNumber: number) {
    const offsetForLinesPointingTop = this.levelOffset(currentLevel);
    return `${this.totalOffset(currentLevel, itemNumber) - this.totalOffset(0, 0) + this.COUPLE_ITEM_HEIGHT/2 - (itemNumber%2 ? offsetForLinesPointingTop : 0)}px`;
  }

  left(currentLevel: number) {
    return `${this.LEVEL_WIDTH * currentLevel}px`;
  }

  lineLeft(currentLevel: number) {
    return `${this.LEVEL_WIDTH * currentLevel - 200}px`;
  }

  totalOffset(currentLevel: number, itemNumber: number) {
    let offset = 0;
    for (let level = 0; level <= currentLevel; level++) {
      offset += this.sign(level, currentLevel, itemNumber) * this.levelOffset(level);
    }

    return offset;
  }

  lineHeight(level: number) {
    return `${this.levelOffset(level)}px`;
  }

  individualRecord(level: number, itemNumber: number, gender: Sex): IndividualRecord | undefined | null {
    const record: PedigreeCouple | null = Array(level).fill(1).reduce((previousPedigreeCouple: PedigreeCouple, _ , index) => {
      return this.sign(index, level, itemNumber) === 1 ? previousPedigreeCouple.father.parentPedigreeCouple : previousPedigreeCouple.mother.parentPedigreeCouple;
    }, this.pedigree);
    return gender === Sex.Male ? record?.father?.individualRecord : record?.mother?.individualRecord;
  }

  get levelArray(): number[] {
    return Array(this.levelDepth).fill(1).map((x,i)=>i);
  }

  get levelWidthInPx(): string {
    return `${this.LEVEL_WIDTH}px`;
  }

  private get heightOfPedigreeChart(): number {
    return this.totalOffset(this.levelDepth, 0) - this.totalOffset(0, 0);
  }

  private sign(level: number, currentLevel: number, itemNumber: number) {
    const levelItemCount = 2**level;
    const currentLevelItemCount = 2**currentLevel;
    const bucketSize = currentLevelItemCount / levelItemCount;
    return Math.floor(itemNumber/bucketSize) % 2 ? 1 : -1;
  };

  private levelOffset(currentLevel: number) {
    let sum = 0;
    for(let level = 0; level < this.levelDepth - currentLevel; level++) {
      sum += 2**(this.levelDepth - level - currentLevel - 2) * this.paddingArray[level];
    }
    return sum;
  }

  private get paddingArray(): number[] {
    return this.levelArray.map(level => {
      if (level === 0) return 125;
      else return level * 10;
    });
  }

  private setTransform() {
    const pedigreeHeight = this.heightOfPedigreeChart * 1.2 * 2;
    this.containerWidth = this.elementView?.nativeElement?.offsetWidth;
    this.containerHeight = this.elementView?.nativeElement?.offsetHeight;
    this.scaleFactor = -1 * this.containerHeight / pedigreeHeight;
  }
}
