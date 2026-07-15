section .data
    prompt      db "minishell> ", 0
    prompt_len  equ $ - prompt
    err_msg     db "Invalid command.", 0Ah
    err_len     equ $ - err_msg

section .bss
    input_buf   resb 256

section .text
    global _start

_start:
.main_loop:
    mov rax, 1
    mov rdi, 1
    mov rsi, prompt
    mov rdx, prompt_len
    syscall

    mov rax, 0
    mov rdi, 0
    mov rsi, input_buf
    mov rdx, 256
    syscall

    cmp rax, 0
    jle .exit

    mov rsi, input_buf
.strip_newline:
    mov al, [rsi]
    cmp al, 0x0A
    je .found_newline
    cmp al, 0
    je .execute
    inc rsi
    jmp .strip_newline

.found_newline:
    mov byte [rsi], 0

.execute:
    mov al, [input_buf]
    cmp al, 0
    je .main_loop
    
    mov rax, 57
    syscall

    cmp rax, 0
    jl .main_loop
    je .child_process

    mov rdi, -1
    xor rsi, rsi
    xor rdx, rdx
    xor r10, r10
    mov rax, 61
    syscall

    jmp .main_loop

.child_process:
    push 0
    push input_buf
    mov rsi, rsp

    mov rdi, input_buf
    xor rdx, rdx

    mov rax, 59
    syscall

    mov rax, 1
    mov rdi, 1
    mov rsi, err_msg
    mov rdx, err_len
    syscall

    mov rax, 60
    mov rdi, 1
    syscall

.exit:
    mov rax, 60
    xor rdi, rdi
    syscall
