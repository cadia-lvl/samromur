# About

Samrómur v2 is a data collection platform greatly influenced by Mozilla Common Voice.

## Technical features
* Next.js - The minimalistic framework for server-rendered React applications.
* next-pwa - A zero config PWA plugin for Next.js
* jwt - User authentication and sessions with jsonwebtokens
* i18n - Internationalization framework.
* Typescript - Superset of JavaScript which primarily provides optional static typing, classes and interfaces.
* Redux - A predictable state container for JavaScript applications.
* typesafe-actions - Typesafe utilities designed to reduce types verbosity and complexity in Redux Architecture.
* Babel - The compiler for next generation JavaScript.
* Styled Components - Style components directly using template literals.

## Contributing

### *Prerequisites*
* Node.js version 12+
* MySQL 8.0.19
* ffmpeg

### *Setup*
* Create and populate **config.json** and **database.json**. Structure can be found in their corresponding sample versions. Setting up the e-mail server is optional while developing.
### *Development*
* PWA support is disabled in development

```
npm install
npm run dev
```

### *Production*
* The start command injects *NODE_ENV=production* on the fly and there is a separate command for starting on Windows because of a slightly different syntax doing that.
```
npm run build

npm run start | npm run start:windows
```

## License
[MIT License](/LICENSE)