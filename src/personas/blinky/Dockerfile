FROM node:22-slim

# WORKDIR /app
# COPY ../../core ./core

WORKDIR /app/bot

COPY . .
RUN npm install

CMD ["npm","start"]
# CMD ["tail", "-f", "/dev/null"]