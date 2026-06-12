# Flapazon

Plateforme marketplace en architecture microservices (NestJS) avec un frontend Angular.
Le tout est orchestré avec Docker.

## Prerequis

- Docker
- Docker Compose

## Lancement

```bash
cp .env.example .env
docker compose up --build
```

Au premier lancement, les images sont construites puis les conteneurs demarrent
(base de donnees PostgreSQL, MongoDB, les microservices, le gateway et le frontend).

## Acces

- Frontend : http://localhost:4200
- API Gateway : http://localhost:3000

Documentation Swagger de chaque service :

- Authentification : http://localhost:3001/docs
- Produits : http://localhost:3002/docs
- Stocks : http://localhost:3003/docs
- Commandes : http://localhost:3004/docs

## Compte administrateur de test

- Email : admin@flapazon.fr
- Mot de passe : testtest

Il est aussi possible de creer un compte client ou vendeur depuis la page d'inscription.

## Arret

```bash
docker compose down
```

Pour supprimer aussi les donnees des bases :

```bash
docker compose down -v
```
