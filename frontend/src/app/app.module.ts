import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { LandingComponent } from './shared/components/landing/landing.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { reducers, CustomSerializer } from './shared/reducer';
import { RouterEffects } from './shared/route/route-effect';

const routes: Routes = [
    { path: '', redirectTo: 'documents', pathMatch: 'full' }, // for easy testing, temporary
    { path: 'landing', pathMatch: 'full', component: LandingComponent },
    { path: 'users', loadChildren: './user/user-state.module#UserStateModule'},
    { path: 'documents', loadChildren: './document/document-state.module#DocumentStateModule' },
    { path: 'files', loadChildren: './file/file-state.module#FileStateModule' },
    { path: 'alerts', loadChildren: './alert/alert-state.module#AlertStateModule' },
    { path: '**', redirectTo: 'users/signin' }
];


@NgModule({
    declarations: [
        AppComponent,
        LandingComponent,
        NavbarComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        RouterModule.forRoot(routes),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([
            RouterEffects
        ]),
        StoreDevtoolsModule.instrument({ maxAge: 25   }),
        StoreRouterConnectingModule,
    ],
    providers: [
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: APP_BASE_HREF, useValue: '/'},
    ],
    exports: [
        StoreModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
