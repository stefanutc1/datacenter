variable "environment" {
  type        = string
  description = "Environment name"
}

variable "ami_id" {
  type        = string
  description = "AMI ID for the instance"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID to launch the instance into"
}
