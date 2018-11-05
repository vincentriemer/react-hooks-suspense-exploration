FROM mhart/alpine-node:10 as base
ARG REACT_APP_TMDB_API_KEY

WORKDIR /usr/src
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN echo "REACT_APP_TMDB_API_KEY=${REACT_APP_TMDB_API_KEY}" > .env
RUN yarn build
RUN mv ./build /public

