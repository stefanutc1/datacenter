; ==============================================================================
; Low-Level Linux x86_64 Emergency Kernel Reboot Utility
; Direct syscall 169 (sys_reboot) with Linux magic numbers without systemd wrapper.
; ==============================================================================

section .data
    msg      db "🚨 [ASM REBOOT] Invoking Linux kernel sys_reboot syscall...", 0Ah
    msg_len  equ $ - msg

    ; Linux reboot magic numbers
    ; LINUX_REBOOT_MAGIC1 = 0xfee1dead
    ; LINUX_REBOOT_MAGIC2 = 672274793 (0x28121969)
    ; LINUX_REBOOT_CMD_RESTART = 0x01234567

section .text
    global _start

_start:
    ; 1. Print message
    mov rax, 1                  ; sys_write
    mov rdi, 1                  ; stdout
    mov rsi, msg
    mov rdx, msg_len
    syscall

    ; 2. Sync filesystems before reboot (sys_sync, syscall 162)
    mov rax, 162                ; sys_sync
    syscall

    ; 3. Invoke sys_reboot (syscall 169)
    ; int reboot(int magic, int magic2, int cmd, void *arg);
    mov rax, 169                ; sys_reboot
    mov rdi, 0xfee1dead         ; magic1
    mov rsi, 672274793          ; magic2 (0x28121969)
    mov rdx, 0x01234567         ; LINUX_REBOOT_CMD_RESTART
    xor r10, r10                ; arg = NULL
    syscall

    ; 4. If reboot fails (e.g. not root/CAP_SYS_BOOT), exit with code 1
    mov rax, 60                 ; sys_exit
    mov rdi, 1
    syscall
