; ==============================================================================
; Low-Level x86_64 CPUID & Virtualization Hardware Feature Detector
; Queries CPU Vendor string and hypervisor present bit via CPUID instruction.
; ==============================================================================

section .data
    banner_msg   db "CPU Vendor ID: "
    banner_len   equ $ - banner_msg

    newline      db 0Ah
    hyp_yes      db "[+] Hypervisor Detected (Running inside VM/LXC)", 0Ah
    hyp_yes_len  equ $ - hyp_yes

    hyp_no       db "[-] Bare-Metal Host (No Hypervisor Bit set)", 0Ah
    hyp_no_len   equ $ - hyp_no

section .bss
    vendor_str   resb 13

section .text
    global _start

_start:
    ; 1. Query CPUID with EAX=0 (Get Vendor ID string)
    xor eax, eax
    cpuid

    ; Vendor string returned in EBX, EDX, ECX (12 bytes)
    mov [vendor_str + 0], ebx
    mov [vendor_str + 4], edx
    mov [vendor_str + 8], ecx
    mov byte [vendor_str + 12], 0Ah

    ; Print "CPU Vendor ID: "
    mov rax, 1
    mov rdi, 1
    mov rsi, banner_msg
    mov rdx, banner_len
    syscall

    ; Print Vendor string (e.g. "GenuineIntel\n" or "AuthenticAMD\n")
    mov rax, 1
    mov rdi, 1
    mov rsi, vendor_str
    mov rdx, 13
    syscall

    ; 2. Query CPUID with EAX=1 (Feature flags)
    mov eax, 1
    cpuid

    ; ECX bit 31 indicates Hypervisor Presence
    bt ecx, 31
    jc .is_hypervisor

    ; Bare metal
    mov rax, 1
    mov rdi, 1
    mov rsi, hyp_no
    mov rdx, hyp_no_len
    syscall
    jmp .exit

.is_hypervisor:
    mov rax, 1
    mov rdi, 1
    mov rsi, hyp_yes
    mov rdx, hyp_yes_len
    syscall

.exit:
    mov rax, 60         ; sys_exit
    xor rdi, rdi        ; exit code 0
    syscall
