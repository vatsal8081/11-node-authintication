# Steps

## general notes

- always use user.save() methos of mongoose to add or update user.

- always create sperate file name auth for route,validation, controler and add all auth related things there.

- create seprate functions in hapler for create hash password, compair two passwords generate token and varify token so we can reuse.

- generate token will created in a way that it takes issuer as argument and it will be from enum and the seckret and time for issuer will be come from env so we can use token for multiple things.

- always extrect wanted keys from user request and create seprate object and then create or edit from them insted of passing whole request in create so no one can set extra data like role in user if they also pass in request

- jwt seckret key should be atlest 32 char long and secret and expire time should be in env

- all auth related routes should be prefixed with /auth/

- always use findOne or findById helpers to get user so it never ever come in multiple object for auth related things.

- always create passLastChangedAt field in user model which will be null and set current date time when user change his password so we can check passLastChangedAt > token issue time then user change pass after token issued so we consider it as invalid token.

- always make sure when you have to set passLastChangedAt you first do it and set it's value and then only generate token because of token generated first and field set after it will be always invalid token. we use async so before passLastChangedAt saves if generate token resolve it will be invalid token always. so set value in user object then save then generate token.

- always create middlewere as function which return middlewere so if you want yo can pass some value in future as param of function and use in middlewere.

- use token creation and varify funcnality for reset pass tokens as well.

- never save the user in request in authorize because in app when we need populated user somewere and this will be very massed up. so create helper function which will get token and extrect user from it and send it so when we need populated user in future we just change function query so every place which relay on request user will get same data of user object.

- try to seprate email and pass change route from normal user data update so no one can chnage it with user update they need to five old and new pass for pass chnage and verify new email by given token in old email for security.

1. create model

- create user interface entity
- create user model
- install becryptjs and create pre save hook where you will check if password there and isModified then hash it
- set select as false in user model in all password, passLastChangedAt and other fields which don't neede in response. so it never some in response in any query only come when select explictly.

2. sign up

- create signin validation interface and schima and validate user request with email not already exist async check.
- create user with extracting only needed data from req
- delete password and passLastChangedAt and other fields because it will be there for create even select it false.
- generate token with userId payload.
- send response.

3. login

- create ligin validation interface and schima and validate user request
- check if email and password exist in request for extra safty if not send oprational err
- check if user exist then check password by becrypt compair
- generate token
- send response.

4. authenticated

- create authenticated middlewere in common middlewere
- check if authorization header is not there or not starts with Bearer semd 401
- get token from header and varify
- get user from token userId with passLastUpdatedAt field if no user send 401
- if passLastUpdatedAt in there and passLastUpdatedAt > token issued time then send 401
- catch token expire and token errors which will come from varify tocan in catch with 401 otherwise 500 response
- if everything ok return next()

5. forgot pass

- create forgot pass validation interface and schima and validate
- if no email incase for sefty send oprational err
- find user from email if not found send 404
- generate pass reste token and send to email
- send response

6. reste pass

- create reste pass validation interface and schima and validate
- get pass reste token from param if not there send oprational err
- decode token and find user from token userId if no user send 404
- set password and passLastUpdatedAt at current date time
- save user then generate token and send as response
- catch token invalid and token related errs in catch block and send 400 otherwise 500

7. update pass by user

- create update pass validation interface and schima and validate
- get user from token and no user send 401
- check if old pass is correct
- set passLastUpdatedAt set new pass then save user
- create new token and send response.
