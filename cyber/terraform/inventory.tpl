---
all:
  hosts:
%{ for name, conf in nodes ~}
    ${name}:
      ansible_host: ${conf.ip}
      node_role: ${conf.role}
%{ endfor ~}
