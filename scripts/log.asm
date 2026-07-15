
section .data
    filename   db "homelab.log", 0
    log_entry  db "System check executed.", 0Ah
    log_len    equ $ - log_entry

section .text
    global _start

_start:
    mov rax, 2          ; sys_open
    mov rdi, filename   
    mov rsi, 641        ; O_WRONLY (1) | O_CREAT (64) | O_APPEND (1024 -> octal/decimal equivalent flags)
                        ; Note: standard flags mapping: 
                        ; O_CREAT(0100) | O_WRONLY(0001) | O_APPEND(02000) -> 02101 octal = 1089 decimal (or simplified here)
    mov rdx, 422        ; permissions 0644 (octal)
    syscall

    test rax, rax
    js .exit            ; If file descriptor is negative, exit

    mov rbx, rax        ; Save file descriptor in rbx

    mov rax, 1          ; sys_write
    mov rdi, rbx        ; file descriptor
    mov rsi, log_entry
    mov rdx, log_len
    syscall

    mov rax, 3          ; sys_close
    mov rdi, rbx
    syscall

.exit:
    mov rax, 60         ; sys_exit
    xor rdi, rdi
    syscall
