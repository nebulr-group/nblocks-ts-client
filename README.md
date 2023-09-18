# Nebulr NBlocks TS Client
Welcome to NBlocks, the platform toolbox from Nebulr made by developers for developers. If you're new to this concept, head over to our site and check out the capabilities.

[nblocks.dev](https://nblocks.dev)

# Installing
## Stable
```
npm i @nebulr-group/nblocks-ts-client
```

## Beta

```
npm i @nebulr-group/nblocks-ts-client@beta
```

## Alpha (local Verdaccio)
```
npm i @nebulr-group/nblocks-ts-client@alpha --registry http://verdaccio:4873 
```

# Publishing
Publishing is handled by Github actions.

## Publish stable version (NPM)
```
npm run npm-publish
```

## Publish beta version (NPM)
Versions are tagged as beta and should be suffixed with `-beta.X`, e.g. `3.0.0-beta.4`

```
npm run npm-publish-beta
```

## Publish alpha version (local Verdaccio)
Versions are tagged as alpha and should be suffixed with `-alpha.X`, e.g. `3.0.0-alpha.4`

```
npm run npm-publish-local
```
