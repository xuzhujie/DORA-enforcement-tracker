#!/usr/bin/env python3
"""Check official DORA pages and append source-backed update snapshots.

The script intentionally stores hashes and links rather than trying to infer
legal meaning from page text. Human review remains the gate for any record
that is promoted into the tracker dataset.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import sys
import tempfile
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_PATH = ROOT / "public" / "data" / "updates.json"
SOURCES = [
    {
        "name": "EBA DORA root",
        "url": "https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act",
        "title_zh": "EBA DORA 监管入口",
        "summary_zh": "EBA DORA 官方活动与监管入口页面有更新。",
        "summary_en": "The official EBA DORA activity and oversight page changed.",
        "source": "EBA",
    },
    {
        "name": "EBA DORA oversight",
        "url": "https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight",
        "title_zh": "EBA DORA 监督入口",
        "summary_zh": "EBA DORA 监督页面有更新，需人工核对是否影响适用性或行动项。",
        "summary_en": "The official EBA DORA oversight page changed; review whether applicability or action items are affected.",
        "source": "EBA",
    },
]


class _TitleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "title":
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.parts.append(data)


def extract_title(content: bytes) -> str:
    parser = _TitleParser()
    parser.feed(content.decode("utf-8", errors="replace"))
    return html.unescape(" ".join(parser.parts)).strip()


def content_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def build_update(source: dict[str, str], content: bytes, checked_at: str) -> dict[str, Any]:
    title = extract_title(content) or source["name"]
    return {
        "title": title,
        "title_zh": source["title_zh"],
        "summary": source["summary_en"],
        "summary_zh": source["summary_zh"],
        "summary_en": source["summary_en"],
        "link": source["url"],
        "date": checked_at,
        "source": source["source"],
        "source_hash": content_hash(content),
    }


def latest_event_for_source(current_items: list[dict[str, Any]], link: str) -> dict[str, Any] | None:
    source_items = [item for item in current_items if item.get("link") == link]
    if not source_items:
        return None
    return max(source_items, key=lambda item: item.get("date") or "")


def has_changed(current_items: list[dict[str, Any]], link: str, digest: str) -> bool:
    latest = latest_event_for_source(current_items, link)
    return latest is None or latest.get("source_hash") != digest


def merge_updates(current_items: list[dict[str, Any]], new_items: list[dict[str, Any]], limit: int = 20) -> list[dict[str, Any]]:
    """Prepend this run's events without deduplicating against historical events."""
    seen_in_run: set[tuple[str, str]] = set()
    unique_new_items: list[dict[str, Any]] = []
    for item in new_items:
        key = (item.get("link", ""), item.get("source_hash", ""))
        if key in seen_in_run:
            continue
        seen_in_run.add(key)
        unique_new_items.append(item)
    return [*unique_new_items, *current_items][:limit]


def monitor_exit_code(failures: int, total_sources: int) -> int:
    """Fail CI when any configured official source could not be checked."""
    return 1 if failures > 0 and total_sources > 0 else 0


def load_snapshot(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"updated_at": None, "source": "EBA DORA official pages", "items": []}
    with path.open("r", encoding="utf-8") as handle:
        snapshot = json.load(handle)
    snapshot.setdefault("items", [])
    return snapshot


def write_snapshot(path: Path, snapshot: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as handle:
        json.dump(snapshot, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary_path = Path(handle.name)
    os.replace(temporary_path, path)


def fetch_source(url: str, timeout: int = 20) -> bytes:
    request = Request(url, headers={"User-Agent": "DORA-enforcement-tracker/0.1 (+official-source-monitor)"})
    with urlopen(request, timeout=timeout) as response:
        return response.read()


def set_github_outputs(changed: bool, new_items: list[dict[str, Any]]) -> None:
    output_path = os.environ.get("GITHUB_OUTPUT")
    if not output_path:
        return
    with open(output_path, "a", encoding="utf-8") as handle:
        handle.write(f"changed={'true' if changed else 'false'}\n")
        handle.write(f"new_count={len(new_items)}\n")
        handle.write(f"new_items_json={json.dumps(new_items, ensure_ascii=False)}\n")


def run(data_path: Path = DEFAULT_DATA_PATH, checked_at: str | None = None, timeout: int = 20) -> int:
    checked_at = checked_at or date.today().isoformat()
    snapshot = load_snapshot(data_path)
    current_items = snapshot.get("items", [])
    new_items: list[dict[str, Any]] = []
    failures = 0

    for source in SOURCES:
        try:
            content = fetch_source(source["url"], timeout=timeout)
            update = build_update(source, content, checked_at)
            if has_changed(current_items, update["link"], update["source_hash"]):
                new_items.append(update)
                print(f"changed: {source['url']}")
            else:
                print(f"unchanged: {source['url']}")
        except Exception as exc:  # noqa: BLE001 - monitoring should report all sources
            failures += 1
            print(f"failed: {source['url']} ({exc})", file=sys.stderr)

    changed = bool(new_items)
    if changed:
        snapshot["items"] = merge_updates(current_items, new_items)
        snapshot["updated_at"] = checked_at
        snapshot["source"] = "EBA DORA official pages"
        write_snapshot(data_path, snapshot)
        print(f"wrote {len(new_items)} update(s) to {data_path}")
    else:
        print("no new updates")

    set_github_outputs(changed, new_items)
    return monitor_exit_code(failures, len(SOURCES))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-file", type=Path, default=DEFAULT_DATA_PATH)
    parser.add_argument("--timeout", type=int, default=20)
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    raise SystemExit(run(data_path=arguments.data_file, timeout=arguments.timeout))
