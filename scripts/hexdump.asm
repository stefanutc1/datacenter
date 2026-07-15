section .data
    hex_chars   db "0123456789ABCDEF"
    newline     db 0Ah

section .bss
    file_buf    resb 16
    out_buf     resb 80

section .text
    global _start

_start:
    pop rbx
    cmp rbx, 2
    jl .exit

    pop rsi
    pop rdi

    mov rax, 2
    xor rsi, rsi
    syscall

    cmp rax, 0
    jl .exit
    mov rbx, rax

.read_loop:
    mov rax, 0
    mov rdi, rbx
    mov rsi, file_buf
    mov rdx, 16
    syscall

    test rax, rax
    jle .close_file

    mov r8, rax

    jmp .read_loop

.close_file:
    mov rax, 3
    mov rdi, rbx
    syscall

.exit:
    mov rax, 60
    xor rdi, rdi
    syscall
