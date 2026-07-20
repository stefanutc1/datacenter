import json

ip_list = [
    "192.168.100.10",
    "10.0.0.0/24",
    "172.16.5.5"
]

def generate_alias_import():
    alias_data = {
        "name": "Blocked_External_Threats",
        "type": "network",
        "address": " ".join(ip_list),
        "descr": "Auto-generated alias from Python script"
    }
    
    with open("alias_export.json", "w") as f:
        json.dump(alias_data, f, indent=4)
        
    print("Alias configuration generated successfully in alias_export.json")

if __name__ == "__main__":
    generate_alias_import()
