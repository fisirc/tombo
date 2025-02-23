package main

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

func main() {
	config := LoadConfig()

	ctx := context.Background()
	rdb := redis.NewClient(&redis.Options{
		Addr: config.RedisURL,
	})

	pubsub := rdb.Subscribe(ctx, "mychannel1")
	defer pubsub.Close()

	ch := pubsub.Channel()

	fmt.Println("📨 Waiting for notifications in pub/sub channel")
	for msg := range ch {
		fmt.Println("❄️", msg.Channel, msg.Payload)
	}
}
