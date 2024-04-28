FROM node:20-slim as build

ENV PATH $PATH:/app/node_modules/.bin

WORKDIR /app

COPY . .
COPY [".env.production", "/app"]

COPY package.json ./


RUN yarn install
RUN yarn add sharp --ignore-engines


RUN echo `node -v`
RUN echo `ls /app/node_modules`

RUN export NEXT_SHARP_PATH=/app/node_modules/sharp && \
    yarn build /app

FROM node:20-slim as prod

ENV PATH $PATH:/app/node_modules/.bin

EXPOSE 3000/tcp

WORKDIR /app

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/.next .next
COPY --from=build /app/pm2.config.js ./
COPY --from=build /app/public public
COPY --from=build /app ./

ENTRYPOINT ["next", "dev"]