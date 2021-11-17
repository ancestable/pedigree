import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';
import { CoupleComponent } from './components/couple/couple.component';
import { IndividualComponent } from './components/individual/individual.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    CoupleComponent,
    IndividualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private injector: Injector,
  ) {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('ancestable-pedigree', el);
  }
}
