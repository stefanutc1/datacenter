.PHONY: deploy

deploy:
	ansible-playbook -i inventory.ini playbook.yml
