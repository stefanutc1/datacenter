#!/usr/bin/env perl
use strict;
use warnings;
use FindBin qw($Bin);
use lib "$Bin/lib";
use Getopt::Long;
use PuttyANSI qw(red green yellow cyan bold reset_color);

print bold(cyan("=== Remote Tail Log Alert Monitor ===\n"));
