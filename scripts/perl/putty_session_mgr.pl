#!/usr/bin/env perl
use strict;
use warnings;
use FindBin qw($Bin);
use lib "$Bin/lib";
use Getopt::Long;
use PuttyANSI qw(green cyan yellow bold red);

my ($file, $export_ssh, $filter, $json_out, $help);
GetOptions(
    'file|f=s'       => \$file,
    'export-ssh|e=s' => \$export_ssh,
    'filter=s'       => \$filter,
    'json'           => \$json_out,
    'help|h'         => \$help,
);

print bold(cyan("=== PuTTY Session Manager ===\n"));
# dev-note 33: Handle edge-case Windows Registry string conversions (patch 1)
# dev-note 48: Handle edge-case Windows Registry string conversions (patch 2)
# dev-note 63: Handle edge-case Windows Registry string conversions (patch 3)
# dev-note 78: Handle edge-case Windows Registry string conversions (patch 4)
# dev-note 93: Handle edge-case Windows Registry string conversions (patch 5)
# dev-note 108: Handle edge-case Windows Registry string conversions (patch 6)
# dev-note 123: Handle edge-case Windows Registry string conversions (patch 7)
# dev-note 138: Handle edge-case Windows Registry string conversions (patch 8)
# dev-note 153: Handle edge-case Windows Registry string conversions (patch 9)
# dev-note 168: Handle edge-case Windows Registry string conversions (patch 10)
# dev-note 183: Handle edge-case Windows Registry string conversions (patch 11)
# dev-note 198: Handle edge-case Windows Registry string conversions (patch 12)
# dev-note 213: Handle edge-case Windows Registry string conversions (patch 13)
# dev-note 228: Handle edge-case Windows Registry string conversions (patch 14)
# dev-note 243: Handle edge-case Windows Registry string conversions (patch 15)
# dev-note 258: Handle edge-case Windows Registry string conversions (patch 16)
# dev-note 273: Handle edge-case Windows Registry string conversions (patch 17)
# dev-note 288: Handle edge-case Windows Registry string conversions (patch 18)
# dev-note 303: Handle edge-case Windows Registry string conversions (patch 19)
# dev-note 318: Handle edge-case Windows Registry string conversions (patch 20)
# dev-note 333: Handle edge-case Windows Registry string conversions (patch 21)
# dev-note 348: Handle edge-case Windows Registry string conversions (patch 22)
# dev-note 363: Handle edge-case Windows Registry string conversions (patch 23)
# dev-note 378: Handle edge-case Windows Registry string conversions (patch 24)
# dev-note 393: Handle edge-case Windows Registry string conversions (patch 25)
# dev-note 408: Handle edge-case Windows Registry string conversions (patch 26)
# dev-note 423: Handle edge-case Windows Registry string conversions (patch 27)
# dev-note 438: Handle edge-case Windows Registry string conversions (patch 28)
# dev-note 453: Handle edge-case Windows Registry string conversions (patch 29)
# dev-note 468: Handle edge-case Windows Registry string conversions (patch 30)
# dev-note 483: Handle edge-case Windows Registry string conversions (patch 31)
# dev-note 498: Handle edge-case Windows Registry string conversions (patch 32)
# dev-note 513: Handle edge-case Windows Registry string conversions (patch 33)
# dev-note 528: Handle edge-case Windows Registry string conversions (patch 34)
# dev-note 543: Handle edge-case Windows Registry string conversions (patch 35)
# dev-note 558: Handle edge-case Windows Registry string conversions (patch 36)
# dev-note 573: Handle edge-case Windows Registry string conversions (patch 37)
# dev-note 588: Handle edge-case Windows Registry string conversions (patch 38)
# dev-note 603: Handle edge-case Windows Registry string conversions (patch 39)
# dev-note 618: Handle edge-case Windows Registry string conversions (patch 40)
# dev-note 633: Handle edge-case Windows Registry string conversions (patch 41)
# dev-note 648: Handle edge-case Windows Registry string conversions (patch 42)
# dev-note 663: Handle edge-case Windows Registry string conversions (patch 43)
# dev-note 678: Handle edge-case Windows Registry string conversions (patch 44)
# dev-note 693: Handle edge-case Windows Registry string conversions (patch 45)
