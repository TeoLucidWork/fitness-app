# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS TypeScript fitness application built with the standard NestJS framework structure. The application runs on port 3000 by default and follows standard NestJS conventions with modules, controllers, and services.

## Development Commands

### Build & Development
- `npm run build` - Build the application
- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start in development mode with file watching
- `npm run start:debug` - Start with debugging enabled and file watching
- `npm run start:prod` - Start using the built dist files

### Code Quality
- `npm run lint` - Run ESLint with auto-fix on TypeScript files
- `npm run format` - Format code using Prettier

### Testing
- `npm run test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:debug` - Run tests in debug mode

## Architecture

This is a standard NestJS application with the following structure:
- `src/main.ts` - Application entry point, bootstraps the NestJS app on port 3000
- `src/app.module.ts` - Root module that imports all other modules
- `src/app.controller.ts` - Main application controller
- `src/app.service.ts` - Main application service
- `test/` - Contains e2e test files

The application uses:
- TypeScript with strict type checking
- Jest for testing (unit tests in `*.spec.ts` files, e2e tests in `test/` directory)
- ESLint and Prettier for code quality
- Standard NestJS dependency injection and module system

## Key Configuration Files

- `nest-cli.json` - NestJS CLI configuration with source root in `src/`
- `tsconfig.json` & `tsconfig.build.json` - TypeScript configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules