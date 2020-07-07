FROM node:8.15

ENV APP_HOME=/Users/vsingla/GitHub/jobRequisition1

COPY . $APP_HOME
WORKDIR $APP_HOME
RUN npm install
RUN npm run compile
USER nobody
CMD echo Please run a node script