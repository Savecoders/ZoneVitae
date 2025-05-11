# Angular and C# .NET Core Web API
# This Dockerfile is used to build a multi-stage Docker image for an Angular frontend and a C# .NET Core Web API backend.

# Build the Angular app
FROM node:24-alpine3.20 AS build-client

COPY ./client/ /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]


# Build the .NET Core Web API
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-server
# WORKDIR /app

# # Copy the .NET Core Web API source code
# COPY ./api/*.csproj ./
# COPY ./api/ ./

# # Restore dependencies and build the .NET Core Web API
# RUN dotnet restore
# RUN dotnet publish -c Release -o out




