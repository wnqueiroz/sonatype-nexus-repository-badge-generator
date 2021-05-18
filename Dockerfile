FROM node:14.17.0-alpine3.13 as builder

WORKDIR /builder

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:14.17.0-alpine3.13 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=8082
ENV PORT=${PORT}

EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY --from=builder /builder ./

CMD ["npm", "run", "start:prod"]