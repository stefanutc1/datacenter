variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block for the public subnet"
}
