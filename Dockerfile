FROM node:14.15.4-slim

RUN npm install -g @nestjs/cli@9.4.2 npm@8.19.3

USER node

WORKDIR /home/node/app

CMD ["sh", "-c", "npm install && tail -f /dev/null"]