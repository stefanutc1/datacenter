import paramiko
import re
from datetime import datetime

HOST = ""
PORT = 22
USERNAME = ""
PASSWORD = ""

def backup_pfsense_config():
    print(f"Connecting to pfSense at {HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USERNAME, password=PASSWORD)
        
        stdin, stdout, stderr = ssh.exec_command("cat /conf/config.xml")
        config_data = stdout.read().decode('utf-8')
        
        sanitized_config = re.sub(r'<password>.*?</password>', '<password>REDACTED</password>', config_data)
        sanitized_config = re.sub(r'<cert>.*?</cert>', '<cert>REDACTED</cert>', sanitized_config)
        sanitized_config = re.sub(r'<private-key>.*?</private-key>', '<private-key>REDACTED</private-key>', sanitized_config)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"config_pfsense_{timestamp}.xml"
        
        with open(filename, "w") as f:
            f.write(sanitized_config)
            
        print(f"Backup successful! Saved as {filename}")
        
    except Exception as e:
        print(f"Backup failed: {e}")
    finally:
        ssh.close()

if __name__ == "__main__":
    backup_pfsense_config()
