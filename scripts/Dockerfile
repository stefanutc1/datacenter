# Admin Automation CLI bundling Perl, Ruby, OpenSSH & Session Management
FROM alpine:3.20

# Install Ruby, Perl, make, bash, openssh
RUN apk add --no-cache bash ruby ruby-bundler perl perl-app-cpanminus make openssh-client curl git

WORKDIR /app
COPY . /app

RUN chmod +x /app/perl/*.pl 2>/dev/null || true \
    && chmod +x /app/ruby/*.rb 2>/dev/null || true

CMD ["bash", "-c", "echo 'PuTTY & SSH Admin Toolset Ready. Run make test or execute scripts in /app/perl/ or /app/ruby/' && bash"]
