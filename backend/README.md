# Backend NestJS

Este directorio contiene la API construida con **NestJS** y **Prisma**.

## Desarrollo

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

La API se sirve en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api`.

Para ejecutar base de datos y aplicación con Docker:

```bash
docker-compose up --build
```

## Seed de datos

```bash
npm run migrate
npm run seed
```

Esto cargará los datos iniciales de `db.json` y un usuario admin `admin@example.com` con contraseña `admin`.

## Ejemplo de consumo desde React

```javascript
const token = '...';
fetch('http://localhost:3000/alumnos', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log);
```

Con **axios**:

```javascript
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { Authorization: `Bearer ${token}` }
});
api.get('/alumnos').then(r => console.log(r.data));
```

### Nuevas Categorías Automáticas por Edad

- Prebenjamín (6–7 años | 2018–2019): Fútbol 5/7, juego básico
- Benjamín (8–9 años | 2016–2017): Fútbol 7, habilidades básicas
- Alevín (10–11 años | 2014–2015): Transición técnica, fútbol 7/11
- Infantil (12–13 años | 2012–2013): Desarrollo táctico, fútbol 11
- Cadete (14–15 años | 2010–2011): Posiciones especializadas
- Juvenil (16–18 años | 2007–2009): Preparación para fútbol senior
- Senior (19+ años | ≤2006): Nivel competitivo adulto