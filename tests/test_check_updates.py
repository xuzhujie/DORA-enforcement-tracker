import unittest
import json
from pathlib import Path

from scripts.check_updates import build_update, extract_title, has_changed, merge_updates, monitor_exit_code


class CheckUpdatesTests(unittest.TestCase):
    def test_committed_update_snapshot_is_valid_json(self):
        snapshot_path = Path(__file__).parents[1] / "public" / "data" / "updates.json"
        with snapshot_path.open("r", encoding="utf-8") as handle:
            snapshot = json.load(handle)
        self.assertGreaterEqual(len(snapshot["items"]), 1)

    def test_extract_title_reads_html_title(self):
        html = b"<html><head><title> EBA DORA oversight </title></head></html>"
        self.assertEqual(extract_title(html), "EBA DORA oversight")

    def test_build_update_keeps_bilingual_metadata_and_hash(self):
        item = build_update(
            {
                "name": "EBA DORA oversight",
                "url": "https://example.test/dora",
                "title_zh": "EBA DORA 监督入口",
                "summary_zh": "中文摘要",
                "summary_en": "English summary",
                "source": "EBA",
            },
            b"<title>EBA DORA oversight</title>fresh",
            "2026-11-20",
        )

        self.assertEqual(item["title_zh"], "EBA DORA 监督入口")
        self.assertEqual(item["summary_en"], "English summary")
        self.assertEqual(item["source"], "EBA")
        self.assertEqual(len(item["source_hash"]), 64)

    def test_has_changed_compares_source_hashes(self):
        current = [{"link": "https://example.test/dora", "source_hash": "abc"}]
        self.assertFalse(has_changed(current, "https://example.test/dora", "abc"))
        self.assertTrue(has_changed(current, "https://example.test/dora", "def"))
        self.assertTrue(has_changed(current, "https://example.test/other", "abc"))

    def test_has_changed_compares_only_the_latest_event_for_a_source(self):
        current = [
            {"link": "https://example.test/dora", "source_hash": "new", "date": "2026-11-20"},
            {"link": "https://example.test/dora", "source_hash": "old", "date": "2026-11-19"},
        ]
        self.assertFalse(has_changed(current, "https://example.test/dora", "new"))
        self.assertTrue(has_changed(current, "https://example.test/dora", "old"))

    def test_merge_updates_keeps_a_reverted_hash_as_a_new_event(self):
        current = [
            {"link": "https://example.test/dora", "source_hash": "new", "date": "2026-11-20"},
            {"link": "https://example.test/dora", "source_hash": "old", "date": "2026-11-19"},
        ]
        reverted = {"link": "https://example.test/dora", "source_hash": "old", "date": "2026-11-21"}

        merged = merge_updates(current, [reverted])

        self.assertEqual(len(merged), 3)
        self.assertEqual(merged[0]["date"], "2026-11-21")
        self.assertEqual(merged[2]["date"], "2026-11-19")

    def test_partial_source_failure_fails_the_monitor(self):
        self.assertEqual(monitor_exit_code(0, 2), 0)
        self.assertEqual(monitor_exit_code(1, 2), 1)
        self.assertEqual(monitor_exit_code(2, 2), 1)


if __name__ == "__main__":
    unittest.main()
