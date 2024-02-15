########################################
# build 
########################################
FROM node:18.16.0-slim  AS builder

WORKDIR /usr/src/api-server

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --frozen-lockfile

COPY ./src ./src
COPY ./tsconfig*.json ./

RUN npm run build

########################################
# run node.js server
########################################

FROM node:18.16.0-slim 

ARG PORT=4000

WORKDIR /usr/src/api-server

COPY --from=builder /usr/src/api-server/package.json ./package.json
COPY --from=builder /usr/src/api-server/package-lock.json ./package-lock.json
COPY --from=builder /usr/src/api-server/tsconfig*.json ./

RUN npm pkg delete scripts.prepare && npm install --omit=dev

COPY --from=builder /usr/src/api-server/dist ./dist

ENV NODE_ENV=deploy
EXPOSE $PORT

CMD ["node", "dist/src/server.js"]