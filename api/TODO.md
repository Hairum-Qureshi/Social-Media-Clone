1. Still need to implement the route controller function for deleting a post's comment
2. Need to add a "numPosts" property to the User model
3. Sanitize backend input to prevent NoSQL injections!
4. Sometimes the 'Following' tab has a white screen and when refreshing logs you out
5. For some reason you're not redirected when you register for an account/login
6. If you click on a post's back button from the user's profile, it should take them back to their profile, not the main feed
7. Instead of it prompting the sign in page when the site is loading, change it so it's actually a loading screen
8. Prevent users from being able to increment/decrement number of followers if they spam the follow/unfollow button
9. For some reason there's a slight delay when sending messages; they're no longer instant like before
10. When creating a DM contact, it doesn't accurately display their activity status; it's false by default
11. When you're on a post's page and you delete it, have the user redirected back to the main feed
12. For posts with images, allow the user to click on the images to get a closer look and make sure to update the URL param too
13. Prevent a redirect for posts if you're clicking on the arrows for the post's image slideshow
14. Try to replicate the image display for a post X has for 3 images
15. Allow users to post without captions and just images
16. Allow users to pin posts
17. Add a character limit for user names [sic]
18. Allow users to private their accounts
19. Note that each profile is being cached in React Query. Consider having it so that it expires after a certain amount of time so that you don't have hundreds of profiles in your cache
20. When the user gets a DM request, send an email to the user letting them know
21. Need to make it so that the message content is trimmed to prevent users from sending messages that are just empty lines
22. Need to have it so that if a post has images, if they click on it, it'll redirect to the gallery route
23. If you're in the gallery and add a non-existent image number, it'll display no image; redirect the user back to the post
24. If a profile doesn't have a bio, the 'follow' button is raised too high
25. For the search box for the messaging user search modal, use query params instead of the request body
26. If a user deletes their account, you might need to remove their userIDs from the "likedBy", "bookmarkedBy", etc. arrays
27. Prevent it so that if you have the "edit post" editor open, you can't open the "create post" editor
28. There seems to be an issue where the editor for editing a post's width isn't that wide
29. Allow users to close the editor modal for creating/editing posts
30. If you choose to "pin to profile" on the feed, the text doesn't change to "unpin from profile"
31. For some reason, the first search in the bookmarks page is really slow
32. Occasionally run into the "Profile.tsx:40 Uncaught TypeError: currentProfilePostData is not iterable" error -- need to add a null guard or something
33. Add logic to prevent the like/bookmark counter from incrementing when the user spams the button to unlike/like or bookmark/un-bookmark a post
34. When you update your username, your username on your profile's posts don't get updated
35. For the "liked posts" tab on the user profile, make sure it's sorted so the newest liked post goes on top
36. Bug on user extended bio page where it displays the user's bio but also "Tell us about yourself" (see route: /el.xer/bio from another profile)
37. The API code for retrieving all the user's posts' images only works for the current user; if another user visits another user's profile page, it doesn't display that user's posts' images on their profile
38. When you try to follow/unfollow a user on their profile by pressing the button, the button text does not change
39. Think about what to do if a user you haven't followed sends a DM request and you follow them back - should you add code to automatically change that DM request to a regular convo?
40. Make the 'pin DM/conversation' feature work
41. If you're looking at the group chat info tab on a DM request, it's not going to tell you who's the admin(s); either disable the info button for DM requests or fix it so it shows the admin(s)
42. Need to add a character limit for group chat names

## Features to implement:

1. Tagging users
2. Allowing retweet
3. Add a translation feature where users are able to translate posts that are written in a different language
4. Add verification badges to users/profiles
5. Add a block feature
6. Add a feature where tags and @ing users, the text color is blue and @ing users notifies them
7. Encrypting/decrypted user messages
8. Add a 'numDMRequests' property to User model where instead of checking the length of the dmRequests array, you'll have a dynamic number that increments/decrements
