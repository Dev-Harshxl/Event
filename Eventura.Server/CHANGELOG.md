This file explains how Visual Studio created the project.

The following steps were used to generate this project:
- Create new ASP\.NET Core Web API project.
- Update project file to add a reference to the frontend project and set SPA properties.
- Update `launchSettings.json` to register the SPA proxy as a startup assembly.
- Add project to the startup projects list.
- Write this file.



Nice-to-haves (you can add later)

Refresh tokens (persist in DB with rotation & invalidation)

Password reset (email OTP/provider)

Email confirmation (send verification link)

Role-based authorization: [Authorize(Roles="Admin")]

Rate limiting on auth endpoints

Audit logging for logins/registrations

Validation with FluentValidation


meditr