FROM golang:1.24.0-alpine3.21 AS build

WORKDIR /app

# Copy the Go module files
COPY go.mod .
COPY go.sum .

# Download the Go module dependencies
RUN go mod download

COPY . .

RUN go build -o /app/notifications-service

FROM alpine:latest AS run

# Copy the application executable from the build image
COPY --from=build /app/notifications-service /notifications-service

WORKDIR /app
CMD ["/notifications-service"]
