import { IDatasetModelWithRecords, WindowObservable } from '@ancestable/shared';
import { Component, OnInit } from '@angular/core';
import { testData } from 'src/assets/test-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pedigree';

  ngOnInit() {
    WindowObservable.DatasetWithRecords.publish(testData as unknown as IDatasetModelWithRecords);
  }
}
