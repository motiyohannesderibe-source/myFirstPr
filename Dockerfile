FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/StoreTrae.Api.csproj backend/
RUN dotnet restore backend/StoreTrae.Api.csproj

COPY backend/ backend/
RUN dotnet publish backend/StoreTrae.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "StoreTrae.Api.dll"]