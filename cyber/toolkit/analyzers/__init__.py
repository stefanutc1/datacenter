"""Detection and forensic analyzers."""

from cyber.analyzers.base import BaseAnalyzer
from cyber.analyzers.aitm_detector import AitmDetector
from cyber.analyzers.telephony_fraud_detector import TelephonyFraudDetector
from cyber.analyzers.task_scam_analyzer import TaskScamAnalyzer
from cyber.analyzers.active_directory_analyzer import ActiveDirectoryAnalyzer

ALL_ANALYZERS = [
    AitmDetector(),
    TelephonyFraudDetector(),
    TaskScamAnalyzer(),
    ActiveDirectoryAnalyzer()
]
