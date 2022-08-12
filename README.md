# OIDC
This module is used to manage user login with OIDC & [Authentik](https://goauthentik.io/)

> tested on version: 2022.8

# How it's work

## Step 1: init the module
Init the module with required var: (endpoint, client_id, client_secret, redirectUrl)

| Name | Type | Description |
| :--- | :--- | :---------- |
| endpoint | string | the base endpoint, for example `https://auth.alice-snow.me` |
| client_id | string | your app client id |
| client_secret | string | your app client secret |
| redirectUrl | string |  the callback uri, for example `https://myFamulousProject.amelia.lu/login/callback` |

```ts
import { OIDC } from "https://deno.land/x/oidc/mod.ts";
const myoidc = new OIDC("https://auth.alice-snow.me", MY_CLIENT_PUB, MY_CLIENT_PRIV, "https://myFamulousProject.amelia.lu/login/callback")
```

## Step 2: (facultative) get your redirection url
You need: (scope, states)

| Name | Type | Description |
| :--- | :--- | :---------- |
| scope | string | the auth scope for the user, for example `["openid", "profile", "email"]` |
| states | string | random string block security issue (keep blank if you want) |

```ts
const redirectUrl = myoidc.generateAuthUrl(["openid", "profile", "email"], "aliceIsAPrincess") // "aliceIsAPrincess" is actualy a random string :D
```

> redirect the user to this url to perform the authentication

## Step 3: get the user infos
App is theoretically responding you after the authentication.

Format: `/login/callback?code=HERE_THE_CODE&state=aliceIsAPrincess`

call `OIDC.authUser(code)` to get back the data.

```ts
const userData = myoidc.authUser(HERE_THE_CODE)

/* 
Successfull response: 
{
    sucess: true,
    data: USER_DATA
};

USER_DATA example data: 
{
    "email": "snow.alice@pm.me",
    "email_verified": true,
    "name": "Alice",
    "given_name": "Alice",
    "family_name": "Snow",
    "preferred_username": "alice",
    "nickname": "alice",
    "groups": [
        "user"
    ],
    "sub": "buyvaAB86B9A87A098908978VVGHVJHhvad"
}
*/

```