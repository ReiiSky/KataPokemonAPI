# BUILD
FROM node:22-alpine AS build
ARG DATABASE_URL=${DATABASE_URL}

WORKDIR /app
COPY package*.json .
RUN npm install --ignore-scripts

COPY . ./
RUN npx prisma generate

RUN export DATABASE_URL=${DATABASE_URL}

RUN npm run compile
# RUN npx ncc build --out dist \
#   --minify \
#   --no-cache \
#   --target es2024 \
#   build/source/RunRest.js

# RUNABLE
FROM node:22-alpine AS runable
ARG DATABASE_URL=${DATABASE_URL}

WORKDIR /app/runable

COPY package*.json .
RUN npm install --ignore-scripts --omit dev

COPY prisma .
RUN npx prisma generate

RUN export DATABASE_URL=${DATABASE_URL}

COPY --from=build /app/build /app/runable/build

CMD ["npm", "run", "run:rest"]
