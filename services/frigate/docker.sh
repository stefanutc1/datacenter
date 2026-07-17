docker run -d \
  --name frigate \
  --restart unless-stopped \
  --shm-size=64mb \
  --device /dev/dri/renderD128 \
  -p 5000:5000 \
  -p 8554:8554 \
  -p 8555:8555/tcp \
  -p 8555:8555/udp \
  -v /etc/localtime:/etc/localtime:ro \
  -v $(pwd)/config:/config \
  -v $(pwd)/storage:/media/frigate \
  -e FRIGATE_RTSP_PASSWORD="" \
  ghcr.io/blakeblackshear/frigate:stable
