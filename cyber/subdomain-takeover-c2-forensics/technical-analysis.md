# Technical Analysis: DNS Lifecycle Verification & Drift Remediation

## Takeover Lifecycle

```
[ Compromised Host ] ---> [ Firewall / Proxy ] ---> [ metrics.enterprise.internal ]
                                |                            |
                        (Rule: Allow *.corp)           (CNAME Pointer)
                                                             v
                                            [ corp-telemetry-legacy.azurewebsites.net ]
                                                             |
                                                             v
                                                [ Attacker Azure Tenant ]
```

## Automated Detection Script (Python)

```python
import dns.resolver
import requests

def check_dangling_cname(domain: str) -> bool:
    try:
        answers = dns.resolver.resolve(domain, 'CNAME')
        for rdata in answers:
            target = str(rdata.target).rstrip('.')
            if 'azurewebsites.net' in target:
                res = requests.get(f'http://{domain}', timeout=5)
                if '404 Web Site not found' in res.text or res.status_code == 404:
                    return True
    except Exception:
        pass
    return False
```

## Remediation Protocol

1. **DNS Audit:** Implement automated CI/CD checks scanning Route 53 and Cloudflare zone files for CNAME records pointing to nonexistent cloud targets.
2. **Cloud Verification Tokens:** Configure Azure Custom Domain Verification IDs (`asuid.<subdomain>`) to prevent third parties from claiming unverified DNS names.
3. **DNSSEC:** Enforce signed DNS records to ensure integrity across intermediate resolvers.
