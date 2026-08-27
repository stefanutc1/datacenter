---

### D. CTF Scenario Bootstrap Script (`ctf-challenges/lab-privesc/setup.sh`)
```bash
#!/bin/bash
echo "[*] Initializing CTF PrivEsc scenario..."

# Create a test user
useradd -m -s /bin/bash ctfuser
echo "ctfuser:ctfpassword" | chpasswd

# Set up simulated flag
mkdir -p /root/flag-container
echo "CTF{cyberlab_l0c4l_pr1v3sc_success}" > /root/flag-container/flag.txt
chmod 700 /root/flag-container

echo "[+] Lab environment is ready!"
