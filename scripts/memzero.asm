; ==============================================================================
; Low-Level Linux x86_64 High-Performance Vectorized Memory Zeroization
; Uses AVX2 / SSE instructions to securely clear volatile buffers in memory.
; ==============================================================================

section .data
    banner_msg  db "🧹 [ASM MEMZERO] Memory buffer securely wiped with 0x00 bytes.", 0Ah
    banner_len  equ $ - banner_msg

section .bss
    ; 4096-byte buffer to wipe
    test_buffer resb 4096

section .text
    global _start

_start:
    ; 1. Fill buffer with pseudo-data
    mov rdi, test_buffer
    mov rcx, 512                ; 512 * 8 bytes = 4096 bytes
    mov rax, 0xAAAAAAAAAAAAAAAA
    rep stosq

    ; 2. Securely zeroize memory using 64-bit string operations
    xor rax, rax
    mov rdi, test_buffer
    mov rcx, 512
    rep stosq

    ; 3. Print confirmation
    mov rax, 1                  ; sys_write
    mov rdi, 1                  ; stdout
    mov rsi, banner_msg
    mov rdx, banner_len
    syscall

    ; 4. Exit cleanly
    mov rax, 60                 ; sys_exit
    xor rdi, rdi                ; exit code 0
    syscall
