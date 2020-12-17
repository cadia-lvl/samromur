# Samrómur

Samrómur is a crowdsourcing data collection platform for icelandic. Samrómur aims to collect icelandic voice data which can be used to train voice-recognition software. Data collected via Samrómur is GDPR compliant. The dataset consists of multiple wav files containing the voice clips and the corresponding written text files along with demographic data about the speakers. 


The application is written in Typescript and uses React to build the website. It has a frontend for the data collection and a backend for API calls and data storage.

## History
[Samromur v1](https://github.com/aime-island/raddvefur 'Raddvefur repository') was a fork from [Mozilla Common Voice](https://github.com/mozilla/common-voice/ 'Mozilla Common Voice repository').
This project (Samromur v2) is instead build from the ground up but it is greatly influenced by Mozilla Common Voice.

## Technologies
* Next.js - The minimalistic framework for server-rendered React applications.
* next-pwa - A zero config Progressive Web App (PWA) plugin for Next.js
* jwt - User authentication and sessions with jsonwebtokens
* i18n - Internationalization framework.
* Typescript - Superset of JavaScript which primarily provides optional static typing, classes and interfaces.
* Redux - A predictable state container for JavaScript applications.
* typesafe-actions - Typesafe utilities designed to reduce types verbosity and complexity in Redux Architecture.
* Babel - The compiler for next generation JavaScript.
* Styled Components - Style components directly using template literals.

## Development

### *Requirements*
The following needs to be installed on your system to be able to start developing.
* Node.js version 12+
* MySQL 8.0.19
* ffmpeg

**Note:** This project uses [prettier](https://prettier.io/ 'Prettier Home Page'), an opinionated code formatter, to automatically format the code for a uniform codeset. It is warmly recommended to use the prettier plugin for the IDE you are using.

### *Configuration*
You will need to populate two configuration files **config.json** and **database.json**.
* The **config.json** includes setup for the Database, Server port, S3 bucket and Email server. 
* The **database.json** is necessary for database migrations to work but should include similar data as the database in **config.json**. 

The structure of these files can be found in the corresponding sample versions.

### *S3*
The application uses S3 buckets for clip and metadata storage. If you are setting this project up from scratch you will need to setup your own S3 instance. For more infromation about how to do that visit the [AWS docs](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html 'Creating a S3 bucket').

### *Database*
After you have installed MySQL you will need to setup a database. If you are setting this project up from scratch you will need to setup your own database instance and root user. The database migration tool will then create the necessary tables and columns for you when you start up the application for the first time.

### *Setup*
* Clone the project
* Create and populate **config.json** and **database.json**. 
* Run the following commands:
```
npm install
npm run dev
```
* Done! Happy coding.

**Please note:** PWA support is disabled in development
## Production
The only difference in setup between developement and production is the npm commands to run.
Follow the development steps for **Requirements, Configuration, S3, Database** and **Setup** but instead run these commands.
* The start command injects *NODE_ENV=production* on the fly and there is a separate command for starting on Windows because of a slightly different syntax doing that.

```
npm run build
npm run start | npm run start:windows
```

## License
[MIT License](/LICENSE)