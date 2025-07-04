# Angular and C# .NET Core Web API
# This Dockerfile is used to build a multi-stage Docker image for an Angular frontend and a C# .NET Core Web API backend.


# Stage 1: Build the Angular app
# Build the Angular app
FROM node:24-alpine3.20 AS build-client

WORKDIR /app/client

COPY client/package*.json ./

# Install dependencies
RUN npm install --yes-cache

# Copy the rest of the application code

COPY client/. .

RUN npm run build --prod


# Stage 2: Build the Angular app for production
# Build the .NET Core Web API
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-api
WORKDIR /app/api

# Copy the .NET Core Web API csproj file and restore dependencies

COPY api/*.csproj ./

RUN dotnet restore

COPY api/. .

# Build and publish a release
RUN dotnet publish -o out

# Stage 3: Build the final image
# Build runtime image

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

# Copy the Angular build output to the final image

COPY --from=build-client /app/client/dist/zone-vitae/browser ./wwwroot

COPY --from=build-api /app/api/out ./


EXPOSE 80

ENTRYPOINT ["dotnet", "api.dll"]
