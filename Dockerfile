FROM node:10.21.0

WORKDIR /usr/src/magic-brain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]