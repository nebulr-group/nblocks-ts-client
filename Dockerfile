# syntax=docker/dockerfile:1

# Supports ARM + x86-64
# 'as base' allows us to refer to this build stage in other build stages
FROM node:14-buster AS base
SHELL ["/bin/bash", "-c"]


# Set the root working dir inside container
# Use relative paths based on the working dir
WORKDIR "/app"

RUN npm install -g typescript
# Set layer caching for faster builds
# Runs only on package.json and package-lock.js change
COPY ["package.json", "package-lock.json", "./"]

# Refering to base, and adding new build stage label 'test'
FROM base AS test
# Installing prod and dev dependencies
RUN npm install
# Copy rest of the projects source code to container env
COPY . .
# Run build with installed dep
RUN npm run build

# Refering to base, and adding new build stage label 'dev'
FROM base AS dev
# Installing prod and dev dependencies
RUN npm install
# Copy rest of the projects source code to container env
COPY . .
# Run build with installed dep
# RUN npm run build


# Refering to base, and adding new build stage label 'prod'
FROM base AS prod
# Installing prod dependencies
RUN npm install --production
# Copy rest of the projects source code to container env
COPY . .
# Run build with installed dep
RUN npm run build 