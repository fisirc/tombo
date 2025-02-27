package main

import (
	"context"
	"fmt"
	"os"

	"github.com/OneSignal/onesignal-go-api"
)

var configuration = onesignal.NewConfiguration()
var apiClient = onesignal.NewAPIClient(configuration)

// NotificationPayload represents the expected JSON structure from the Redis queue
type NotificationPayload struct {
	Title           string   `json:"title"`
	Message         string   `json:"message"`
	Image           string   `json:"image,omitempty"`
	ExternalUserIds []string `json:"external_user_ids"`
}

func PushNotification(config Config, ctx context.Context, payload NotificationPayload) {
	osAuthCtx := context.WithValue(
		ctx,
		onesignal.AppAuth,
		config.OneSignalApiKey,
	)

	notification := *onesignal.NewNotification(config.OneSignalAppId)

	if len(payload.ExternalUserIds) > 0 {
		notification.SetIncludeExternalUserIds(payload.ExternalUserIds)
	} else {
		notification.SetIncludedSegments([]string{"Active Subscriptions"})
	}
	notification.SetIsIos(false)

	messageStringMap := onesignal.StringMap{
		En: &payload.Message,
		Es: &payload.Message,
	}
	titleStringMap := onesignal.StringMap{
		En: &payload.Title,
		Es: &payload.Title,
	}

	if payload.Image != "" {
		notification.BigPicture = &payload.Image
	}
	notification.Headings = *onesignal.NewNullableStringMap(&titleStringMap)
	notification.Contents = *onesignal.NewNullableStringMap(&messageStringMap)

	resp, r, err := apiClient.DefaultApi.CreateNotification(osAuthCtx).Notification(notification).Execute()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CreateNotification`: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
		return
	}

	fmt.Fprintf(os.Stdout, "Response from `CreateNotification`: %v\n", resp)
	fmt.Fprintf(os.Stdout, "Notification ID: %v\n", resp.GetId())
}
