; ==============================================================================
; Low-Level Linux x86_64 Kernel System Information Utility
; Queries sys_sysinfo (syscall 99) directly from kernel space without libc.
; ==============================================================================

section .data
    header_msg   db "=== [HOMELAB ASM KERNEL TELEMETRY] ===", 0Ah
    header_len   equ $ - header_msg

    sysinfo_msg  db "[OK] Kernel sysinfo struct retrieved successfully.", 0Ah
    sysinfo_len  equ $ - sysinfo_msg

    err_msg      db "[ERR] Failed to query sys_sysinfo.", 0Ah
    err_len      equ $ - err_msg

section .bss
    ; struct sysinfo size is 112 bytes on x86_64 Linux
    sysinfo_buf  resb 128

section .text
    global _start

_start:
    ; 1. Print banner
    mov rax, 1                  ; sys_write
    mov rdi, 1                  ; stdout
    mov rsi, header_msg
    mov rdx, header_len
    syscall

    ; 2. Call sys_sysinfo (syscall number 99 on x86_64 Linux)
    mov rax, 99                 ; sys_sysinfo
    mov rdi, sysinfo_buf        ; pointer to struct sysinfo buffer
    syscall

    test rax, rax
    js .error_exit              ; If negative, return error

    ; 3. Print success confirmation
    mov rax, 1                  ; sys_write
    mov rdi, 1                  ; stdout
    mov rsi, sysinfo_msg
    mov rdx, sysinfo_len
    syscall

    ; 4. Exit cleanly
    mov rax, 60                 ; sys_exit
    xor rdi, rdi                ; exit code 0
    syscall

.error_exit:
    mov rax, 1                  ; sys_write
    mov rdi, 2                  ; stderr
    mov rsi, err_msg
    mov rdx, err_len
    syscall

    mov rax, 60                 ; sys_exit
    mov rdi, 1                  ; exit code 1
    syscall
