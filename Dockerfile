# 1단계: NestJS 빌드
FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

# 2단계: 프로덕션 실행
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
# COPY .env.prod ./

EXPOSE 3003

CMD ["npm", "run", "start:prod"]