# Executive Summary

This document summarizes the investigation of a Steam phishing website that abused an OpenID MITM flow to steal credentials and lock victims out of their accounts via Family View / Family Sharing.

All testing was conducted in an isolated Windows VM using temporary, disposable Steam accounts. No real accounts or credentials were used or put at risk at any point in the investigation.

The malicious domain and its hosting IP were reported to Steam Support through the appropriate channel for takedown and internal action.

See [`technical-analysis.md`](./technical-analysis.md) for the full technical breakdown, or [`steam-report.md`](./steam-report.md) for the report as submitted and Steam's response.
