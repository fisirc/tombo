package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis"
)

func main() {
	config := LoadConfig()
	logger := log.New(os.Stderr, "🚨 ", log.LstdFlags)

	ctx := context.Background()
	rdb := redis.NewClient(&redis.Options{
		Addr: config.RedisURL,
	})

	status := rdb.Ping()
	fmt.Println("🚦 Connected to", config.RedisURL, status)

	pubsub := rdb.Subscribe("notifications")
	defer pubsub.Close()

	ch := pubsub.Channel()

	fmt.Println("📨 Waiting for notifications in pub/sub channel")
	for msg := range ch {
		var payload NotificationPayload
		err := json.Unmarshal([]byte(msg.Payload), &payload)
		if err != nil {
			logger.Printf("Error parsing notification payload: %v\n", err)
			continue
		}

		logger.Printf("Received notification: %+v\n", payload)
		PushNotification(*config, ctx, payload)
		logger.Printf("Notification sent to %d recipients\n", len(payload.ExternalUserIds))
	}
}
