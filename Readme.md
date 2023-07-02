## 🛣 Road Crowd Mapping API

Mini API application to manage users and road observations for:

- POTHOLE 🕳
- OBSTACLE 🛸
- CLOSURE 🔒

Application is built with Node.js, Express, Typescript, Sequelize, Zod, JWT, Postgres etc.

---

## 🏗 Setup

- set/change env variables
- to rebuild API after changes: `docker compose up -d api --build`
- to run API normally (faster): `docker compose up -d`
- to run locally (not as a docker container), first fill your pockets with some packages by running: `npm init`
    - than run custom script `npm run dev`
- If you are not running DB from docker-compose, run <u>init.sql</u> manually in your DB server 💻  

---

## 🐛 Test

🔨 No unit/integration testing is implemented, so grab the <u>rcm.postman_collection.json</u>, and test it manually  
🔐 Initial admin is created on DB creation (docker service) with username "admin" and password "adminadmin"  
🚀 Live demo, use url: https://api.rcm.amarildo.xyz 👈

---

### 💌 Todo:

- support geospatial data through PostGIS extension
- create Web-client