# Technical Analysis: BGP Route Monitoring & RPKI Enforcement

## BGP Hijack Mechanics

```
[ Victim User ] ---> [ Tier-1 Transit ISP ]
                            |
           +----------------+----------------+
           | (Longest Match /24)             | (Original /20)
           v                                 v
[ Rogue AS200114 DNS ]              [ Legitimate Route 53 DNS ]
  (198.51.100.0/24)                   (198.51.96.0/20)
           |
           v
[ Poisoned IP: 195.138.22.99 ]
```

## RPKI ROV Validation Command (BIRD / FRRouting)

To automatically reject unauthorized prefix announcements, border routers must enforce Route Origin Authorizations (ROA):

```text
# FRR / BIRD Configuration Segment
protocol rpki {
  rtr server 127.0.0.1 port 8282;
  refresh 300;
  retry 60;
  expire 3600;
}

filter bgp_in {
  if (rpki_verify() == RPKI_INVALID) then {
    reject "Rejecting RPKI Invalid Route: ", net;
  }
  accept;
}
```

## Incident Response Steps

1. **Route Origin Authorization (ROA):** Ensure valid signed ROAs exist in RIPE/ARIN databases with correct Maximum Length constraints (`maxLength 24`).
2. **BGP Monitoring:** Integrate BGPStream / BGPmon alerting for unexpected AS_PATH changes and new prefix announcements.
