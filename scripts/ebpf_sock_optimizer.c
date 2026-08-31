/*
 * ==============================================================================
 * Homelab Low-Level eBPF Network Socket & Buffer Packet Monitor
 * Attaches to XDP / TC hook to inspect socket ring-buffer utilization
 * ==============================================================================
 */

#include <linux/bpf.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/in.h>
#include <linux/tcp.h>

#define SEC(NAME) __attribute__((section(NAME), used))

/* eBPF Map: Packet drop and buffer pressure counters */
struct {
    __uint(type, BPF_MAP_TYPE_PERCPU_ARRAY);
    __type(key, __u32);
    __type(value, __u64);
    __uint(max_entries, 16);
} sock_telemetry_map SEC(".maps");

/*
 * XDP Packet Filter & Socket Ring Buffer Inspector
 */
SEC("xdp")
int homelab_xdp_sock_filter(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data = (void *)(long)ctx->data;

    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;

    /* Filter IPv4 traffic */
    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return XDP_PASS;

    struct iphdr *ip = (void *)(eth + 1);
    if ((void *)(ip + 1) > data_end)
        return XDP_PASS;

    /* Filter TCP protocol for high-throughput stream inspection */
    if (ip->protocol == IPPROTO_TCP) {
        struct tcphdr *tcp = (void *)((void *)ip + (ip->ihl * 4));
        if ((void *)(tcp + 1) > data_end)
            return XDP_PASS;

        __u32 key = 0; /* Index 0: Processed TCP Packets */
        __u64 *count = bpf_map_lookup_elem(&sock_telemetry_map, &key);
        if (count) {
            *count += 1;
        }

        /* Check for SYN burst conditions */
        if (tcp->syn && !tcp->ack) {
            __u32 syn_key = 1;
            __u64 *syn_count = bpf_map_lookup_elem(&sock_telemetry_map, &syn_key);
            if (syn_count) {
                *syn_count += 1;
            }
        }
    }

    return XDP_PASS;
}

char _license[] SEC("license") = "GPL";
