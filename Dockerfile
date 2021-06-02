# build env
FROM node:12-alpine as build

RUN apk update && apk add git

WORKDIR /app

COPY . .

RUN yarn cache clean && yarn

RUN yarn run build

# production env
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]