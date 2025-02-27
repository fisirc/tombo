package main

import (
	"log"
	"os"
)

type Config struct {
	RedisURL string
	OneSignalApiKey string
	OneSignalAppId string
}

func getEnv(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Missing required environment variable: %s", key)
		return "MISSING"
	}
	return value
}

func LoadConfig() *Config {
	return &Config{
		RedisURL: getEnv("REDIS_URL"),
		OneSignalApiKey: getEnv("ONE_SIGNAL_API_KEY"),
		OneSignalAppId: getEnv("ONE_SIGNAL_APP_ID"),
	}
}
