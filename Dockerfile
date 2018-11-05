FROM mhart/alpine-node:10 as base
WORKDIR /usr/src
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN mv ./build /public

