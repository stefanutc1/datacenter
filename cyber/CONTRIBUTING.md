# Contributing to Cyberlab

Thank you for your interest in contributing to this repository! Contributions, ideas, bug reports, and pull requests are always welcome to help improve the security baselines, automation playbooks, and infrastructure documentation.

## How to Contribute

1. **Fork the Repository** and create your branch from `main`.
2. **Make your changes** (whether it's updating Ansible hardening playbooks, audit scripts, or documentation).
3. **Run Linters locally** to ensure your changes adhere to repository standards:
```bash
yamllint .
ansible-lint ansible/

```


4. **Commit your changes** using clear and descriptive commit messages.
5. **Push to your branch** and open a **Pull Request** targeting the `main` branch.

## Code Standards & Guidelines

* **Infrastructure as Code (IaC):** Ensure any new Ansible configurations use fully qualified collection names (FQCN) and follow idempotent patterns.
* **Security Practices:** **Never** commit plaintext passwords, private keys, or sensitive environment variables. Utilize Ansible Vault for sensitive variables.
* **Linting:** All YAML and Ansible files must pass automated lint checks (`yamllint`, `ansible-lint`) before merging.

## Reporting Issues

If you find a security vulnerability, bug, or have a suggestion for improvement, please open an issue with a clear description and steps to reproduce (if applicable).
