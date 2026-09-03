{ config, pkgs, ... }:

{
  imports = [
    ./hardware-configuration.nix
  ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "stefanut";
  networking.networkmanager.enable = true;

  time.timeZone = "Europe/Bucharest";
  i18n.defaultLocale = "en_US.UTF-8";

  users.users.admin = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" "networkmanager" ];
    shell = pkgs.zsh;
    # Adaugă cheia ta publică SSH aici
    # openssh.authorizedKeys.keys = [ "ssh-ed25519 AAAAC3..." ];
  };

  programs.zsh.enable = true;
  environment.systemPackages = with pkgs; [
    git
    htop
    curl
    wget
    tmux
    neovim
    fastfetch
  ];

  services.openssh = {
    enable = true;
    settings = {
      PermitRootLogin = "no";
      PasswordAuthentication = true; 
    };
  };

  virtualisation.docker = {
    enable = true;
    autoPrune.enable = true;
  };

  networking.firewall.enable = true;
  networking.firewall.allowedTCPPorts = [ 22 80 443 ];

  system.autoUpgrade = {
    enable = false; 
    dates = "04:00";
  };

  system.stateVersion = "26.05";
}
