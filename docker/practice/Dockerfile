FROM ubuntu:latest

RUN apt update

RUN apt install -y nginx

WORKDIR /app

COPY index.html .
COPY admin.html /app

ADD https://github.com/theshubhamgour/docker-tutorial  .

EXPOSE 8080

RUN useradd -G sudo -m delta 
RUN chown -R delta:delta /app
USER delta

RUN mkdir /app/logs

ENV ENVIRONMENT=production

LABEL maintainer="Samir Shaikh"