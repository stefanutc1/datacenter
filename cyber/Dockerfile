FROM willhallonline/ansible:latest

RUN apk add --no-cache \
    bash \
    curl \
    git \
    openssh-client

WORKDIR /cyberlab

COPY . .

RUN chmod +x scripts/*.sh vm/*.sh audit/*.sh

CMD ["/bin/bash"]
