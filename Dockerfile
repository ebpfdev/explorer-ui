FROM node:18-alpine

WORKDIR /build

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:1-alpine

COPY --from=0 /build/build /usr/share/nginx/html

EXPOSE 80
