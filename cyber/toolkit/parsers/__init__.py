"""Forensic artifact parsers for network streams, authentication, and system evidence."""

from cyber.parsers.base import BaseParser
from cyber.parsers.auth_relay_parser import AuthRelayParser
from cyber.parsers.sip_voip_parser import SipVoipParser
from cyber.parsers.api_exposure_parser import ApiExposureParser
from cyber.parsers.evtx_sysmon_parser import EvtxSysmonParser
from cyber.parsers.memory_volatility_parser import MemoryVolatilityParser
from cyber.parsers.mft_prefetch_parser import MftPrefetchParser

ALL_PARSERS = [
    AuthRelayParser(),
    SipVoipParser(),
    ApiExposureParser(),
    EvtxSysmonParser(),
    MemoryVolatilityParser(),
    MftPrefetchParser()
]

def get_parser_for_file(file_path: str) -> BaseParser:
    """Return appropriate parser for the given file based on extension and content."""
    for parser in ALL_PARSERS:
        if parser.can_parse(file_path):
            return parser
    return ALL_PARSERS[0]
