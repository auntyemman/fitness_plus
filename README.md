# Fitness+ Membership Management System

This project implements a membership management system for Fitness+, including functionalities to import membership data from Excel, store it in a PostgreSQL database, and send email reminders using cron jobs. The system is built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

## Technologies Used

- **NestJS**: Main framework for building the application, providing a modular structure and dependency injection.
- **TypeORM**: Object-Relational Mapping (ORM) library for TypeScript and JavaScript. Used to interact with the PostgreSQL database.
- **Jest**: JavaScript testing framework for unit testing the application.
- **nodemailer**: Module for sending emails from Node.js applications.
- **xlsx**: Module for reading Excel files in Node.js.
- **cron**: Module for scheduling tasks in Node.js.

## How to Run

1. **Clone the repository**:
2. **Install dependencies**:

3. **Set up environment variables**:

Create a `.env` file in the root directory and add configuration for PostgreSQL and SMTP settings:
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=fitness

SMTP_SERVICE=
SMTP_USER=
SMTP_PASS=

4. **Run the application**:
5. **Run tests**:

## Implementation Details

### 1. Importing and Processing Raw Data

- **Excel Import**: The system uses the `xlsx` module to read Excel files. Data is parsed and stored as JSON objects.
- **Database Interaction**: TypeORM is used to interact with the PostgreSQL database. Membership data is saved using the `MembershipRepository`.

### 2. Email Service

- **Nodemailer**: Emails are sent using nodemailer. The `EmailService` class provides methods for sending general emails and specific membership reminders.
- **SMTP Configuration**: SMTP credentials are stored in environment variables and accessed using `ConfigService` provided by NestJS.

### 3. Cron Job Service

- **Cron Job Definition**: The `MembershipCron` class schedules tasks using the `cron` module. It retrieves membership data and sends reminders based on membership type and due dates.

## Assumptions

- **Environment Configuration**: Assumes PostgreSQL and SMTP server are locally available during development/testing.
- **Data Consistency**: Assumes consistent data format in Excel files for importing memberships.
- **Testing**: Unit tests assume mock data and do not interact with actual database or SMTP servers.

## Future Improvements

- **Error Handling**: Implement more robust error handling and logging.
- **Integration Tests**: Include integration tests for database interactions and email sending.
- **Security**: Implement encryption for sensitive data in transit and at rest.





<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
