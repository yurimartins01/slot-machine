ARG DOTNET_VERSION=10.0-alpine

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build

WORKDIR /src

COPY SlotMachine.Server/SlotMachine.Server.csproj SlotMachine.Server/

RUN dotnet restore SlotMachine.Server/SlotMachine.Server.csproj

COPY . .
RUN dotnet publish SlotMachine.Server/SlotMachine.Server.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SlotMachine.Server.dll"]