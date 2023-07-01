## 🛣 Road Crowd Mapping API

Mini API application to manage users and road observations for:

- POTHOLE
- OBSTACLE
- CLOSURE

Application is built with Node.js, Express, Typescript, Sequelize, Zod, JWT, Postgres etc.

---

## 🏗 Setup

- set/change env variables, for docker compose <u>.env.production</u> is used
- to rebuild API after changes: `docker compose up -d api --build`
- to run API normally (faster): `docker compose up -d`
- to run locally, first fill your pockets with some packages by running: `npm init`
    - than run custom script `npm run dev`

---

## 🐛 Test

No unit/integration testing is implemented, so grab the <u>Postman-Collection.json</u>, and test it manually 🔨

---

### 💌 Todo:

- allow user to change its own password
- upload Postman collection
- support geospatial data through PostGIS extension
- create Web-client