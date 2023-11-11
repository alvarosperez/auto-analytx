# Pull base image.
FROM node:20-alpine as build-deps

WORKDIR /usr/src/app
COPY ./ ./

# install dependencies
RUN apk add gyp python3 make g++
RUN yarn install
RUN yarn build


# NGINX
FROM nginx:1.22-alpine

COPY ../deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
