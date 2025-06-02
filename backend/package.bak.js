{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "seed": "ts-node prisma/seed.ts",
    "migrate": "prisma migrate deploy",
    "generate": "prisma generate"
  },
  "dependencies": {
    "@nestjs/common":           "^10.2.11",
    "@nestjs/core":             "^10.2.11",
    "@nestjs/platform-express": "^10.2.11",
    "@nestjs/passport":         "^10.2.11",
    "@nestjs/jwt":              "^10.2.11",
    "@nestjs/swagger":          "^7.1.0",
    "passport":                 "^0.6.0",
    "passport-jwt":             "^4.0.1",
    "bcrypt":                   "^5.1.0",
    "class-transformer":        "^0.5.1",
    "class-validator":          "^0.14.0",
    "prisma":                   "^5.12.0",
    "@prisma/client":           "^5.12.0",
    "reflect-metadata":         "^0.1.13",
    "rxjs":                     "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli":  "^10.2.11",
    "ts-node":      "^10.9.1",
    "typescript":   "^5.4.3"
  }
}