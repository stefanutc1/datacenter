provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source             = "../../modules/vpc"
  environment        = "dev"
  vpc_cidr           = "10.10.0.0/16"
  public_subnet_cidr = "10.10.1.0/24"
}

module "ec2" {
  source        = "../../modules/ec2"
  environment   = "dev"
  ami_id        = "ami-0c55b159cbfafe1f0" # Example Ubuntu AMI
  instance_type = "t3.micro"
  subnet_id     = module.vpc.public_subnet_id
}
