# election-information-system


## Create a Docker image with build
```
docker build -t <my-docker-container-name> .
docker run -d --name my-postgres-container -p 5432:5432 my-postgres-image
```

## Connect VSCode with postgres database
```
SQLTools (by Matheus Teixeira)
SQLTools PostgreSQL/Cockroach Driver (by Matheus Teixeira)
```

## Install Vite for Docker compose (which is faster than Docker build due to hot file update)
```
npm create vite@latest (Select Name:frontend Framework:React and Variant:Typescript)
cd frontend
npm install
npm run dev
```

click on http://localhost:5173/ and count up.

## Setting Up Backend with TypeScript

```
npm init -y
npm install --save-dev typescript
npm install express
npx tsc
node dist/app.js
```
