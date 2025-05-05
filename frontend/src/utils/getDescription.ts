export function getDescription(notifType: string): string {
    let description = "";
    switch (notifType) {
        case "LIKE":
            description = "liked your post";
            break;
        case "COMMENT":
            description = "commented on your post";
            break;
        case "FOLLOW":
            description = "followed you";
            break;
        case "MESSAGE":
            description = "sent you a message";
            break;
    }

    return description;
}