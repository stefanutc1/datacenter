# ==============================================================================
# AWS VPC & SITE-TO-SITE VPN GATEWAY TO OPNSENSE
# ==============================================================================

resource "aws_vpc" "main" {
  cidr_block           = "10.30.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = merge(var.tags, {
    Name = "vpc-homelab-aws-hub"
  })
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.30.1.0/24"
  availability_zone = "${var.aws_region}a"
  tags = merge(var.tags, {
    Name = "snet-aws-public"
  })
}

resource "aws_vpn_gateway" "vpn_gw" {
  vpc_id = aws_vpc.main.id
  tags = merge(var.tags, {
    Name = "vgw-homelab-aws"
  })
}

resource "aws_customer_gateway" "onprem_gateway" {
  bgp_asn    = 65000
  ip_address = "203.0.113.1"
  type       = "ipsec.1"
  tags = merge(var.tags, {
    Name = "cgw-onprem-opnsense"
  })
}

resource "aws_vpn_connection" "main" {
  vpn_gateway_id      = aws_vpn_gateway.vpn_gw.id
  customer_gateway_id = aws_customer_gateway.onprem_gateway.id
  type                = "ipsec.1"
  static_routes_only  = true
  tags = merge(var.tags, {
    Name = "vpn-aws-to-opnsense"
  })
}
