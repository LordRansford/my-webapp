FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --silent

COPY src ./src

ENV PORT=5055
EXPOSE 5055

CMD ["npm", "run", "dev"]


