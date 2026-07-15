
section .data
    success_msg db "Status OK: System operational.", 0Ah
    success_len equ $ - success_msg

section .text
    global _start

_start:
    mov rax, 42         
    cmp rax, 42
    jne .error_exit

    mov rax, 1          
    mov rdi, 1          
    mov rsi, success_msg
    mov rdx, success_len
    syscall

    mov rax, 60         
    xor rdi, rdi        
    syscall

.error_exit:
    mov rax, 60
    mov rdi, 1
    syscall
