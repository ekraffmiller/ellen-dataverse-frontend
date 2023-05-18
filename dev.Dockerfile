FROM node:19.6.1
WORKDIR /usr/src/app
COPY package.json ./
COPY js-dataverse-2.0.0.tgz ./
COPY /packages/design-system ./packages/design-system
RUN npm install
RUN cd packages/design-system && npm run build && cd ../..
EXPOSE 5173
CMD ["npm", "start"]
