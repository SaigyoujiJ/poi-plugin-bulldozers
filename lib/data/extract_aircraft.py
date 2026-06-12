#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract aircraft performance tables from the wikiwiki.jp KanColle
基地航空隊 page and save them as JSON files under assets/data/aircraft/.

Usage:
    .venv/Scripts/python lib/data/extract_aircraft.py
"""

import json
import os
import re
import sys

import requests
from bs4 import BeautifulSoup


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
URL = "https://wikiwiki.jp/kancolle/%E5%9F%BA%E5%9C%B0%E8%88%AA%E7%A9%BA%E9%9A%8A#performance_table"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
}

# Directory for generated JSON files, relative to the repository root.
OUTPUT_DIR = os.path.join("assets", "data", "aircraft")

# The tables we care about appear directly after the <h3 id="h3_content_1_10">
# heading. There are 35 tables in that section; the first 15 contain the base
# performance data.
SECTION_HEADING_ID = "h3_content_1_10"
TABLE_COUNT = 35
PERFORMANCE_TABLE_COUNT = 15

# ---------------------------------------------------------------------------
# Output schema keys
# ---------------------------------------------------------------------------
SCHEMA_KEYS = [
    "id",
    "name",
    "firepower",
    "torpedo",
    "bombing",
    "aa",
    "aa_sortie",
    "aa_air_defense",
    "asw",
    "los",
    "anti_bomb",
    "interception",
    "accuracy",
    "evasion",
    "range",
    "radius",
    "deployment_cost",
    "bauxite_per_slot",
    "armor",
]

# Japanese column header -> output key.
HEADER_MAP = {
    "No": "id",
    "名称": "name",
    "火力": "firepower",
    "雷装": "torpedo",
    "爆装": "bombing",
    "対空": "aa",
    "対空値(出撃時)": "aa_sortie",
    "対空値(防空時)": "aa_air_defense",
    "対潜": "asw",
    "索敵": "los",
    "対爆": "anti_bomb",
    "迎撃": "interception",
    "命中": "accuracy",
    "回避": "evasion",
    "射程": "range",
    "戦闘行動半径": "radius",
    "配置コスト": "deployment_cost",
    "1スロ当たりのボーキ消費": "bauxite_per_slot",
    "装甲": "armor",
}

# ---------------------------------------------------------------------------
# Categories: which tables are merged into which JSON file.
# ---------------------------------------------------------------------------
# The first 15 tables (indices 0-14) are grouped into 10 natural categories.
CATEGORIES = [
    {
        "key": "land_attackers",
        "file": "land_attackers.json",
        "display": "陸攻、大型陸上機",
        "tables": [0, 1],
    },
    {
        "key": "local_fighters",
        "file": "local_fighters.json",
        "display": "局戦、陸戦",
        "tables": [2],
    },
    {
        "key": "land_recon",
        "file": "land_recon.json",
        "display": "陸偵",
        "tables": [3],
    },
    {
        "key": "carrier_fighters",
        "file": "carrier_fighters.json",
        "display": "艦戦",
        "tables": [4],
    },
    {
        "key": "carrier_torpedo_bombers",
        "file": "carrier_torpedo_bombers.json",
        "display": "艦攻",
        "tables": [5],
    },
    {
        "key": "carrier_dive_bombers",
        "file": "carrier_dive_bombers.json",
        "display": "艦爆",
        "tables": [6],
    },
    {
        "key": "jet_aircraft",
        "file": "jet_aircraft.json",
        "display": "噴式機",
        "tables": [7],
    },
    {
        "key": "seaplanes",
        "file": "seaplanes.json",
        "display": "水爆、水戦",
        "tables": [8, 9],
    },
    {
        "key": "rotary_asw",
        "file": "rotary_asw.json",
        "display": "回転翼機、対潜哨戒機",
        "tables": [10, 11],
    },
    {
        "key": "recon_flying_boats",
        "file": "recon_flying_boats.json",
        "display": "水偵、艦偵、大型飛行艇",
        "tables": [12, 13, 14],
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def parse_value(text):
    """
    Convert a scraped cell value into the canonical representation:
      - empty / '-' -> None
      - integer -> int
      - decimal -> float
      - otherwise -> stripped string
    """
    if text is None:
        return None

    text = text.strip()
    if text == "" or text == "-":
        return None

    # Plain integer
    if re.fullmatch(r"[+-]?\d+", text):
        return int(text)

    # Decimal number
    if re.fullmatch(r"[+-]?\d+\.\d+", text):
        return float(text)

    return text


def parse_table(table):
    """
    Parse a single <table> element and return a list of records using the
    unified schema. Header columns are mapped by their Japanese text.
    """
    rows = table.find_all("tr")
    if not rows:
        return []

    header_cells = rows[0].find_all(["th", "td"])
    headers = [cell.get_text(strip=True) for cell in header_cells]

    has_sortie_aa = "対空値(出撃時)" in headers
    has_defense_aa = "対空値(防空時)" in headers
    has_base_aa = "対空" in headers

    records = []
    for row in rows[1:]:
        cells = row.find_all(["th", "td"])
        # Skip malformed rows with fewer cells than the header.
        if len(cells) != len(headers):
            continue

        # Start with all fields set to None.
        record = {key: None for key in SCHEMA_KEYS}

        # Map known columns directly.
        for header, cell in zip(headers, cells):
            key = HEADER_MAP.get(header)
            if key:
                record[key] = parse_value(cell.get_text(strip=True))

        # Apply the unified anti-air handling rules.
        if has_sortie_aa and has_defense_aa:
            # When detailed sortie / defense AA values exist, the base 'aa'
            # field mirrors the sortie value.
            record["aa"] = record["aa_sortie"]
        elif has_base_aa:
            # A single AA column is duplicated into the detailed fields.
            record["aa_sortie"] = record["aa"]
            record["aa_air_defense"] = record["aa"]

        records.append(record)

    return records


def fetch_html():
    """Fetch the wiki page, retrying once on transient failures."""
    print(f"Fetching {URL} ...")
    try:
        response = requests.get(URL, headers=HEADERS, timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(f"Failed to fetch the wiki page: {exc}") from exc

    if response.status_code != 200:
        raise RuntimeError(
            f"Unexpected status code {response.status_code} for {URL}"
        )

    print(f"Fetched {len(response.text)} bytes (status {response.status_code}).")
    return response.text


def extract_performance_tables(html):
    """
    Locate the section heading and return the first 15 performance tables.
    """
    soup = BeautifulSoup(html, "lxml")
    heading = soup.find("h3", id=SECTION_HEADING_ID)
    if not heading:
        raise RuntimeError(
            f"Could not find section heading <h3 id='{SECTION_HEADING_ID}'>"
        )

    tables = heading.find_all_next("table", limit=TABLE_COUNT)
    if len(tables) < PERFORMANCE_TABLE_COUNT:
        raise RuntimeError(
            f"Expected at least {PERFORMANCE_TABLE_COUNT} tables, found {len(tables)}"
        )

    return tables[:PERFORMANCE_TABLE_COUNT]


def write_json(path, data):
    """Write data as UTF-8 JSON with indentation."""
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    output_dir = os.path.join(repo_root, OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)

    html = fetch_html()
    tables = extract_performance_tables(html)

    summary = []
    manifest = {}

    for category in CATEGORIES:
        records = []
        for idx in category["tables"]:
            records.extend(parse_table(tables[idx]))

        file_path = os.path.join(output_dir, category["file"])
        write_json(file_path, records)

        summary.append((category["file"], len(records)))
        manifest[category["key"]] = {
            "file": category["file"],
            "display": category["display"],
        }

    index_path = os.path.join(output_dir, "index.json")
    write_json(index_path, manifest)

    # Print a concise summary.
    print("\nExtraction complete.")
    print(f"{'File':<35} {'Records':>8}")
    print("-" * 45)
    total = 0
    for filename, count in summary:
        print(f"{filename:<35} {count:>8}")
        total += count
    print("-" * 45)
    print(f"{'Total':<35} {total:>8}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
