.PHONY: all lint harden audit siem triage test clean

all: lint

lint:
	ansible-lint ansible/site.yml || true
	yamllint -c .yamllint ansible/ services/ || true
	python3 -m py_compile ai/*.py

harden:
	ansible-playbook -i inventory/hosts.yml ansible/site.yml

audit:
	./audit/seccheck.sh

lynis:
	./audit/lynis_audit.sh

siem-up:
	docker compose -f services/loki-grafana/docker-compose.yml up -d
	docker compose -f services/wazuh/docker-compose.yml up -d
	docker compose -f services/cyberchef/docker-compose.yml up -d

siem-down:
	docker compose -f services/loki-grafana/docker-compose.yml down
	docker compose -f services/wazuh/docker-compose.yml down
	docker compose -f services/cyberchef/docker-compose.yml down

triage:
	./forensics/triage_collector.sh

ai-analyze:
	python3 ai/agent.py --json
