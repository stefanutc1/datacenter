"""Unit tests for Evidence Hashing and Integrity."""

import os
import tempfile
import unittest
from cyber.core.hashing import compute_hashes, register_evidence, verify_evidence
from cyber.core.exceptions import EvidenceIntegrityError, InvalidInputError

class TestHashing(unittest.TestCase):
    def setUp(self):
        self.temp_file = tempfile.NamedTemporaryFile(delete=False)
        self.temp_file.write(b"FORENSIC_CHAIN_OF_CUSTODY_TEST_DATA")
        self.temp_file.close()

    def tearDown(self):
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)

    def test_compute_hashes(self):
        sha256, sha512, size = compute_hashes(self.temp_file.name)
        self.assertEqual(size, 35)
        self.assertEqual(len(sha256), 64)
        self.assertEqual(len(sha512), 128)

    def test_register_and_verify_evidence(self):
        ev = register_evidence(self.temp_file.name, description="Test Sample")
        self.assertTrue(verify_evidence(ev))

    def test_evidence_tamper_detection(self):
        ev = register_evidence(self.temp_file.name)
        # Tamper with file
        with open(self.temp_file.name, "ab") as f:
            f.write(b"_TAMPERED")
        with self.assertRaises(EvidenceIntegrityError):
            verify_evidence(ev)

if __name__ == "__main__":
    unittest.main()
