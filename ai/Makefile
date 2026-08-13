.PHONY: setup lint clean

setup:
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

lint:
	python3 -c "import json; json.load(open('mcp_config.json'))"
	bash -n scripts/setup.sh
	ansible-lint ansible/playbook.yml

clean:
	rm -rf .cache/
