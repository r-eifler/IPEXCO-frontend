import { LoadTokenEffect } from "./loadToken.effect";
import { LoadUserEffect } from "./loadUser.effect";
import { LoggedInEffect } from "./loggedIn.effect";
import { LoginEffect } from "./login.effect";
import { LogoutEffect } from "./logout.effect";
import { RegisterEffect } from "./register.effect";
import { StoreTokenEffect } from "./storeToken.effect";

export const userFeatureEffects = [
    LoadTokenEffect,
    LoadUserEffect,
    LoggedInEffect,
    LoginEffect,
    LogoutEffect,
    RegisterEffect,
    StoreTokenEffect
]