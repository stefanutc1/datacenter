# Investigation Methodology

1. **Environment Setup**: Isolated Kali Linux VM running through QEMU/KVM to ensure host machine safety.
2. **Reconnaissance**: Static analysis of minified JavaScript assets to identify API endpoints and tracking scripts.
3. **Traffic Interception**: Utilizing Burp Suite to analyze the POST/GET cycle during the registration phase.
4. **Behavioral Testing**: Attempting to bypass SMS verification and regional locks to test backend validation strength.
5. **Data Extraction**: Using the browser console to audit `localStorage` and `sessionStorage` for sensitive data exposure.
