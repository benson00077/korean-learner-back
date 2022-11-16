<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<a name="readme-top"></a>

<details>
  <summary>📔 Table of Contents</summary>
- [1. 👉 About the porject](#1--about-the-porject)
  - [1.1. Built with](#11-built-with)
- [2. 👉 Getting Started](#2--getting-started)
  - [2.1. Prerequisites](#21-prerequisites)
  - [2.2. Running the app](#22-running-the-app)
  - [2.3. Test](#23-test)
- [3. 👉 Usage](#3--usage)
- [4. 👉 Roadmap](#4--roadmap)
- [5. 👉 Acknowledgments](#5--acknowledgments)
  - [5.1. MySQL Notes](#51-mysql-notes)
    - [5.1.1. Commands in common](#511-commands-in-common)
    - [5.1.2. Tables](#512-tables)
    - [5.1.3. Entity Relationship Diagrams](#513-entity-relationship-diagrams)
</details>

<!-- ABOUT THE PROJECT -->

# 1. 👉 About the porject

## 1.1. Built with

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

<p align="right">(<a href="#user-content-readme-top">back to top</a>)</p>

# 2. 👉 Getting Started

## 2.1. Prerequisites

```bash
$ npm install
```

## 2.2. Running the app

```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

## 2.3. Test

```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```

# 3. 👉 Usage

<p align="right">(<a href="#user-content-readme-top">back to top</a>)</p>

# 4. 👉 Roadmap

v0.1.0 Prototype built w/ Python(Flask),see [kosub_api_heroku](https://github.com/benson00077/kosub_api_heroku)

v0.2.0 Built w/ Nest.js

- [ ] Config
  - [ ] Refactor outside app module: [ref](https://stackoverflow.com/questions/69844941/can-i-use-nestjs-config-service-outside-a-module)
- [ ] ORM module
  - [x] init with config module / env
  - [ ] Refactor outsdie app module: [ref](https://docs.nestjs.com/techniques/database#async-configuration)
- [ ] User module
  - [ ] Controller unit test
  - [ ] Hash password
  - [x] No duplicate user / email
  - [ ] Auth strategy
- [ ] Sentence module
  - [x] Bulk insert from json file (via typeORM QueryBuilder)
  - [ ] Bulk insert only under Auth
  - [ ] Support Full Text Search w/ srategies
- [ ] Shows module
  - [ ] note for show name, episode
  - [ ] Mapping the time_stamps_id for each subtitles, which should also include show name and episode
- [ ] Search module
  - [ ] note for search histories and counts
- [ ] Others
  - [ ] Dtos class-validator

<p align="right">(<a href="#user-content-readme-top">back to top</a>)</p>

# 5. 👉 Acknowledgments

## 5.1. MySQL Notes

### 5.1.1. Commands in common

```bash
$ mysql.server start
$ mysql -u root -p

mysql> SHOW DATABASES;
mysql> SHOW GLOBAL VARIABLES LIKE 'PORT';

mysql> CREATE DATABASE `korean_learner`;
mysql> use `kroean_learner`;
mysql> DESC sentenceKo;
```

### 5.1.2. Tables

```sql
-- NOT in use , since we use typeORM
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `username` varchar(50) NOT NULL,
  `hash` BINARY(32) NOT NULL,
  `isActive` BOOLEAN,
  PRIMARY KEY(`id`)
);
-- NOT in use , since we use typeORM
CREATE TABLE IF NOT EXISTS `koPos` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `pos` nvarchar(400) NOT NULL,
  PRIMARY KEY(`id`)
);
```

### 5.1.3. Entity Relationship Diagrams
```mermaid
erDiagram
    %% USERS }|--|{ SENTENCES-KO: collect
    SENTENCES-KO ||--o| SENTENCES-ZH: contains
    SENTENCES-KO ||--o| SENTENCES-EN: contains
    USERS ||--|{ USER_SENTENCE-KO: select
    SENTENCES-KO ||--|{ USER_SENTENCE-KO: map
    USERS ||--|{ USER_SHOW: select
    SHOWS ||--|{ USER_SHOW: map
    USERS ||--|{ USER_SEARCH: record
    SEARCHES ||--|{ USER_SEARCH: map

    USERS {
        int id
        string email
        intArr sentences_id
    }
    SENTENCES-KO {
        int time_stamps_id
        string pos
        string sentences
    }
    SENTENCES-ZH {
        int time_stamps_id
        string sentences
    }
    SENTENCES-EN {
        int time_stamps_id
        string sentences
    }
    SHOWS {
        int id
        intArr user_id
        string name
        int episode
    }
    SEARCHES {
        int id
        int user_id
        str field
        str value
        int counts
    }
    USER_SENTENCE-KO {
        int id
        int user_id
        int time_stamps_id
    }
    USER_SEARCH {
        int id
        int user_id
        int search_id
    }
    USER_SHOW {
        int id
        int user_id
        int show_id
    }
```

<p align="right">(<a href="#user-content-readme-top">back to top</a>)</p>
