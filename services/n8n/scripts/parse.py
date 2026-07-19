import re

raw_log = _input.item.json.get("log", "")
ips = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', raw_log)

return {
    "unique_ips": list(set(ips)),
    "total_found": len(ips)
}
