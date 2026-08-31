{ config, pkgs, ... }:

{
  imports = [ ./hardware-configuration.nix ];

  # Bootloader & Instant Rollback
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.kernelPackages = pkgs.linuxPackages_hardened;

  # Networking
  networking.hostName = "nixos-homelab-node";
  networking.interfaces.eth0.ipv4.addresses = [{
    address = "192.168.1.140";
    prefixLength = 24;
  }];
  networking.defaultGateway = "192.168.1.132";
  networking.nameservers = [ "192.168.1.132" "1.1.1.1" ];

  # Security & Hardening
  security.apparmor.enable = true;
  security.protectKernelImage = true;
  services.fail2ban.enable = true;

  # Declarative Services
  services.openssh = {
    enable = true;
    settings = {
      PasswordAuthentication = false;
      KbdInteractiveAuthentication = false;
      PermitRootLogin = "prohibit-password";
    };
  };

  # Immutable root with ephemeral /tmp
  boot.tmp.useTmpfs = true;
  boot.tmp.cleanOnBoot = true;

  system.stateVersion = "24.05";
}
