import { NgModule } from '@angular/core';
import { userFeature } from './state/user.feature';
import { provideState, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { AuthenticationService } from './services/authentication.service';
import { LoadTokenEffect } from './state/effects/loadToken.effect';
import { LoadUserEffect } from './state/effects/loadUser.effect';
import { LoggedInEffect } from './state/effects/loggedIn.effect';
import { LoginEffect } from './state/effects/login.effect';
import { LogoutEffect } from './state/effects/logout.effect';
import { RegisterEffect } from './state/effects/register.effect';
import { StoreTokenEffect } from './state/effects/storeToken.effect';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    AuthenticationService
  ]
})
export class UserModule { }
