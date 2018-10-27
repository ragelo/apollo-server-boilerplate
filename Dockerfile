# Build Image
FROM node:10 as build-stage

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build

# Production Image
FROM node:10

COPY --from=build-stage /app/package.json /app/package.json

RUN npm --prefix /app install --production

COPY --from=build-stage /app/schemas/schema.json /app/schemas/schema.json
COPY --from=build-stage /app/dist/ /app/dist/

CMD npm --prefix /app run production
