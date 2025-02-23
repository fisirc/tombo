package main

import (
	"log"
	"os"
)

type Config struct {
	RedisURL string
}

func getEnv(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Missing required environment variable: %s", key)
	}
	return value
}

func LoadConfig() *Config {
	return &Config{
		RedisURL: getEnv("REDIS_URL"),
	}
}
