# Nebulr NBlocks TS Client
Welcome to NBlocks, the platform toolbox from Nebulr made by developers for developers. If you're new to this concept, head over to our site and check out the capabilities.

[nblocks.dev](https://nblocks.dev)

This library contains the low level NBlocks client that is shipped with all of our NBlocks plug-n-play experiences for different technologies.  If you haven't looked them in you should as it might save you a bunch of time building your next app and you don't need to install this plugin as it already comes bundled. See the [NBlocks](https://nblocks.dev)

This library is written in typescript and comes with types and documentation built in.

## Documentation
https://nebulr-group.github.io/nblocks-docs/docs/guides/api-client

## Sign up for access
Sign up, register your project and obtain an access token today [here](https://nblocks.dev)!

## Install
If non of our plug-n-play experiences suite your needs, here's how you install the client manually.

```
npm i @nebulr-group/nblocks-ts-client
```

## Quick start
1. Import the PlatformClient from the package

```javascript
import { PlatformClient } from '@nebulr-group/nblocks-ts-client'
```

2. Instantiate a new client with your access token.

```javascript
const client = new PlatformClient("ACCESS_KEY");
```

## Examples
### List all tenants in your app
```javascript
import { Tenant } from '@nebulr-group/nblocks-ts-client'

const tenants:Tenant[] = await client.tenants.list();
tenants.map(t: Tenant => console.log(`Name: ${t.name}, ID:${t.id}`));
```

### Create a new user in a specific tenant
```javascript
const tenantClient = client.tenant("TENANT_ID");

const user = await tenantClient.users.create(
    { username: "john.doe@example.com", role: "ADMIN" }
);
console.log(`User: ${user.id} added to the app!`);
```

### Sending an email to a user
```javascript
const tenantClient = client.tenant("TENANT_ID");
await tenantClient.user("USER_ID").sendEmail(
    {
        subject: "What's up?",
        emailBody: "Hey have a look at this fancy email with my logo and brand",
        ctaTitle: "Read more!",
        ctaUrl: "http://example.com"
    }
);
```

### Sending an email to anyone
```javascript
await client.communicationClient.sendEmail(
    {
        to: "john.doe@example.com",
        emailTitle: "What's up?",
        emailBody: "Hey anyone! Have a look at this fancy email with my logo and brand",
        ctaTitle: "Read more!",
        ctaUrl: "http://example.com"
    }
);
```

### Deactivate a user from logging in
```javascript
await client.tenant("TENANT_ID").user("USER_ID").update({enabled: false});
```

### Resolve user data from request and authorize for a certain action
```javascript
const authResponse = await client.auth.authorize({req, resource: "secure/resource"});

if (authResponse.granted) {
  console.log(`User: ${authResponse.user.fullName} of Account: ${authResponse.user.tenant.name} was granted access to secure/resource`);
}
```

### Upload files
Nblocks supports both direct file uploads via the plugin but also by handing over the heavy lifting to the client UI using a temporary access key with permissions to upload the file straight to NBlocks file storage without putting pressure on your API. The latter is encouraged for best performance.

#### Uploading straight via the plugin
```javascript
import { FileUploadRequest } from '@nebulr-group/nblocks-ts-client'

// Obtain the file client 
const fileClient = app.tenant("TENANT_ID").fileClient;

// Read a file into memory
const file:Buffer = readFileSync("path/to/cat.png");

// Upload the file
const uploadResponse = await fileClient.uploadFile(file, "cat.png", "image/png", true);

console.log(`Uploaded cat.png is now available on: ${uploadResult.signedUrl}`)
```

#### Upload using client handover
```javascript
import { PrepareUploadArgs } from '@nebulr-group/nblocks-ts-client'

const metaData: PrepareUploadArgs = {
    "fileName": "cat.png",
    "contentType": "image/png"
};

const fileClient = app.tenant("TENANT_ID").fileClient;

/**
   * Starts an uploading session that securely shared with an end users that could initiated a HTTP Post upload themselves from browser
   * The response contains all headers required to perform a fast and secure upload
   */
const uploadSession = fileClient.startUploadSession(metaData);

// Use Axios or any other Http client to POST the file data straight our file storage
// Preferrably on the client side for best performance (uploadSession.session is safe to output to client)
const formData: FormData = {...uploadSession.session.fields, {file: file}}
await axios.post(uploadSession.session.url, formData);

// Retrieve a signed url for direct access to the uploaded file
const signedUrl = fileClient.finishUpload({key: uploadSession.key);

console.log(`Uploaded cat.png is now available on: ${signedUrl}`)
```

### Generate and send One Time Password as SMS message
```javascript
const otpMessage = await app.tenant("TENANT_ID").user("USER_ID").sendOtpSms();
console.log(`User ${user.id} recieved OTP: ${otpMessage.code} as SMS`);
```
## Deep dive
The client and its sub clients is organised around the NBlocks feature areas and to be a smooth experience for developers using it. 

A client hierarchy has been setup to allow chaining calls.
```
PlatformClient
│   AuthClient
│   CommunicationClient
│   Tenants (generic client)
│
└───Tenant (specific client)
    │   FileClient
    │   Users (generic client)
    │
    └───User (specific client)
```

* Generic clients lets you do operations that isn't require a certain id to be present. E.g. `create`, `list` etc.
* Specific clients lets you do operations that require a certain id to be present. E.g. `get`, `update`, `delete`, `sendEmail` etc.

This allowed us to accomplish the following experience for our developers.

```javascript
const client = new PlatformClient("ACCESS_KEY");

const aBunchOfUsers = await client.tenant(user.tenant.id).users.list();

const user = client.auth.authorize(authToken, tenantUserId, "secure/endpoint");

await client.tenant(user.tenant.id).user(user.id).sendSms({text: "Hello you"});
```

# Changelog
**TBD as soon as the library leaves beta**

# Developer guide
## Docker container
This project can be opened inside a dev container in visual studio. During the container setup all requirements and tools will be installed

## Developer guide

### Debug log output
*TODO*
### Override service urls
You can override the built in micro service urls to external Nblocks services used for different calls by providing environment variables. These are:
* `NEBULR_PLATFORM_CORE_API_URL`
* `NEBULR_COMMUNICATION_API_URL`
* `NEBULR_FILE_API_URL`
## Npm publish
* To publish a library, make sure to update the package.json version in the project sub folder.
* Make sure you're logged into npm. E.g. `npm login`
* `npm run npm-publish`
