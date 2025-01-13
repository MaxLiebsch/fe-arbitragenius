FROM node:20 as build

ENV PATH $PATH:/app/node_modules/.bin

WORKDIR /app

COPY . .
COPY [".env.production", "/app"]
COPY [".env", "/app"]

RUN apt-get update && apt-get install -y ca-certificates
RUN update-ca-certificates

COPY package.json ./
RUN yarn install
RUN yarn add sharp@v0.33.3 --ignore-engines

RUN export NEXT_SHARP_PATH=/app/node_modules/sharp && \
    yarn build /app
 

FROM node:20-slim as prod

ENV PATH $PATH:/app/node_modules/.bin

EXPOSE 3000/tcp

RUN touch /var/log/app.log
RUN chmod 666 /var/log/app.log

WORKDIR /app

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/package.json ./
COPY --from=build /app/form-data-mock.js ./
COPY --from=build /app/.env.production ./
COPY --from=build /app/.env ./
COPY --from=build /app/.next .next
COPY --from=build /app/pm2.config.js ./
COPY --from=build /app/public public

ENTRYPOINT ["next", "start"]