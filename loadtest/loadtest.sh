#!/bin/bash

# URL of the API endpoint
URL="http://localhost:3000/api/video"

# Path to the file you want to upload
FILE_PATH="./video.mp4"

# Number of requests to send
REQUEST_COUNT=100

# Loop to send requests
for ((i=1; i<=REQUEST_COUNT; i++))
do
  echo "Sending request $i"
  curl -X POST "$URL" -F "video=@$FILE_PATH"
done
