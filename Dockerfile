FROM node:latest

# install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# install other utils
RUN apt-get update -y && apt-get install -y screen
