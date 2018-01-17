# A video facial recognizer using:
* Opencv for facial recognition
* Nodejs/express for the website
* Ffmpeg for video manipulation
* Google Cloud for the server/computation
* Languages:
  * c++, python, javascript, html, css, bash

# Instructions:
The user will upload an mp4 video to the server. Once processing has finished, the video will automatically be playable in the (dynamic) website. The video will have boxes outlined around faces
1. Upload video
2. Wait
3. Play video with facial recognition

# How does it work?
This was a test to see if distributing facial recognition could be improved by using the cloud.
Once a video is sent in, the server will split the video in N segments (3 in our testing; cloud cores get expensive!) and send it to a google storage container.
The N segments will get sent to N cloud cores. Those cores will do the facial recognition computation.
The cores will send back the computed video segments back to the server.
The server pieces back the video and sends it back to the client's page.
