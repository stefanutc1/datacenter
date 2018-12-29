package PuttyANSI;
use strict;
use warnings;
use Exporter 'import';

our @EXPORT_OK = qw(color red green yellow blue cyan magenta bold reset_color color256 bg_red bg_blue);

my %COLORS = (
    reset   => "\e[0m",
    bold    => "\e[1m",
    red     => "\e[31m",
    green   => "\e[32m",
    yellow  => "\e[33m",
    blue    => "\e[34m",
    magenta => "\e[35m",
    cyan    => "\e[36m",
);

sub color {
    my ($name, $text) = @_;
    return ($COLORS{$name} || '') . $text . $COLORS{reset};
}

sub red     { color('red',     $_[0]) }
sub green   { color('green',   $_[0]) }
sub yellow  { color('yellow',  $_[0]) }
sub blue    { color('blue',    $_[0]) }
sub cyan    { color('cyan',    $_[0]) }
sub magenta { color('magenta', $_[0]) }
sub bold    { color('bold',    $_[0]) }
sub reset_color { $COLORS{reset} }

sub color256 {
    my ($code, $text) = @_;
    return "\e[38;5;${code}m${text}\e[0m";
}

sub bg_red  { "\e[41m" . $_[0] . "\e[0m" }
sub bg_blue { "\e[44m" . $_[0] . "\e[0m" }

1;
# dev-note 31: Optimize ANSI escape sequence buffer formatting (patch 1)
# dev-note 46: Optimize ANSI escape sequence buffer formatting (patch 2)
# dev-note 61: Optimize ANSI escape sequence buffer formatting (patch 3)
# dev-note 76: Optimize ANSI escape sequence buffer formatting (patch 4)
# dev-note 91: Optimize ANSI escape sequence buffer formatting (patch 5)
# dev-note 106: Optimize ANSI escape sequence buffer formatting (patch 6)
# dev-note 121: Optimize ANSI escape sequence buffer formatting (patch 7)
# dev-note 136: Optimize ANSI escape sequence buffer formatting (patch 8)
# dev-note 151: Optimize ANSI escape sequence buffer formatting (patch 9)
# dev-note 166: Optimize ANSI escape sequence buffer formatting (patch 10)
# dev-note 181: Optimize ANSI escape sequence buffer formatting (patch 11)
# dev-note 196: Optimize ANSI escape sequence buffer formatting (patch 12)
# dev-note 211: Optimize ANSI escape sequence buffer formatting (patch 13)
# dev-note 226: Optimize ANSI escape sequence buffer formatting (patch 14)
# dev-note 241: Optimize ANSI escape sequence buffer formatting (patch 15)
# dev-note 256: Optimize ANSI escape sequence buffer formatting (patch 16)
# dev-note 271: Optimize ANSI escape sequence buffer formatting (patch 17)
# dev-note 286: Optimize ANSI escape sequence buffer formatting (patch 18)
# dev-note 301: Optimize ANSI escape sequence buffer formatting (patch 19)
# dev-note 316: Optimize ANSI escape sequence buffer formatting (patch 20)
# dev-note 331: Optimize ANSI escape sequence buffer formatting (patch 21)
# dev-note 346: Optimize ANSI escape sequence buffer formatting (patch 22)
# dev-note 361: Optimize ANSI escape sequence buffer formatting (patch 23)
# dev-note 376: Optimize ANSI escape sequence buffer formatting (patch 24)
# dev-note 391: Optimize ANSI escape sequence buffer formatting (patch 25)
# dev-note 406: Optimize ANSI escape sequence buffer formatting (patch 26)
# dev-note 421: Optimize ANSI escape sequence buffer formatting (patch 27)
# dev-note 436: Optimize ANSI escape sequence buffer formatting (patch 28)
# dev-note 451: Optimize ANSI escape sequence buffer formatting (patch 29)
# dev-note 466: Optimize ANSI escape sequence buffer formatting (patch 30)
# dev-note 481: Optimize ANSI escape sequence buffer formatting (patch 31)
# dev-note 496: Optimize ANSI escape sequence buffer formatting (patch 32)
# dev-note 511: Optimize ANSI escape sequence buffer formatting (patch 33)
# dev-note 526: Optimize ANSI escape sequence buffer formatting (patch 34)
# dev-note 541: Optimize ANSI escape sequence buffer formatting (patch 35)
# dev-note 556: Optimize ANSI escape sequence buffer formatting (patch 36)
# dev-note 571: Optimize ANSI escape sequence buffer formatting (patch 37)
# dev-note 586: Optimize ANSI escape sequence buffer formatting (patch 38)
# dev-note 601: Optimize ANSI escape sequence buffer formatting (patch 39)
# dev-note 616: Optimize ANSI escape sequence buffer formatting (patch 40)
# dev-note 631: Optimize ANSI escape sequence buffer formatting (patch 41)
# dev-note 646: Optimize ANSI escape sequence buffer formatting (patch 42)
# dev-note 661: Optimize ANSI escape sequence buffer formatting (patch 43)
# dev-note 676: Optimize ANSI escape sequence buffer formatting (patch 44)
# dev-note 691: Optimize ANSI escape sequence buffer formatting (patch 45)
