# REDDIT CLONE

## Descripción
>### Aplicación Web Clon de Reddit utilizando tecnologías como Nextjs, Tailwind, Typescript, Express, TypeORM y Postgres 
* Visita la Aplicación Web en: http://159.203.162.22/

## Screenshot
<img src="./reddit-clone.gif" height="100%" width="100%">

## Configuración
* Clona el repositorio
* Ejecuta `cd Reddit-Clone`

### Configurar Backend
* Ejecuta `npm install` 
* Crea archivo .env
* Agrega las variables de entorno con el siguiente formato
```
PORT=
NODE_ENV=
APP_URL=
ORIGIN=

JWT_SECRET=

DB_DIALECT=
DB_PORT=
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE= 
```
* Crea la base de datos 
```
psql
CREATE DATABASE redditclone;
```
* Ejecuta `npm run typeorm migration:run`
* Ejecuta `npm run dev`

### Configurar Frontend
* Ejecuta `cd client`
* Ejecuta `npm install`
* Crea archivo .env.local
* Agrega las variables de entorno con el siguiente formato

```
NEXT_PUBLIC_SERVER_BASE_URL=
NEXT_PUBLIC_CLIENT_BASE_URL=
APP_DOMAIN=
```
* Ejecuta `npm run dev`

### Deploy en DigitalOcean
* En el archivo deploy.txt se encuentran los pasos para realizar deploy en la plataforma
