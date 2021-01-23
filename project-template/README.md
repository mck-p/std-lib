# Project Title

## Overview

What does this project do?

## Local Development

```shell
# install all deps
yarn

# copy over default env files
cp env.local .env.local

# allow scripts to be executed locally
chmod +x scripts/**/*

# start backing deps
docker-compose up -d

# start service in development mode
yarn dev
```

## Production

```shell
# install
yarn --production

# start
yarn start
```

## Module Alias

This project uses `module-alias` in order to make requiring files from around the system
easier. `@std-lib/` resolves to the root of this project.