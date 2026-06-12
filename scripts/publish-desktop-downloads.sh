#!/usr/bin/env bash
set -euo pipefail

BUCKET="${BUCKET:-gs://introscribe_bucket}"
RELEASE_DIR="${RELEASE_DIR:-}"
WINDOWS_DIR="$BUCKET/download/win_os"
MAC_DIR="$BUCKET/download/mac_os"

if [[ -z "$RELEASE_DIR" ]]; then
  echo "Set RELEASE_DIR to the folder containing the built desktop release artifacts." >&2
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required. Install and authenticate it before publishing." >&2
  exit 1
fi

if [[ ! -d "$RELEASE_DIR" ]]; then
  echo "RELEASE_DIR does not exist: $RELEASE_DIR" >&2
  exit 1
fi

find_one() {
  local pattern="$1"
  find "$RELEASE_DIR" -maxdepth 1 -type f -name "$pattern" | sort | tail -n 1
}

copy_required() {
  local source="$1"
  local target="$2"
  local cache_control="$3"

  if [[ -z "$source" || ! -f "$source" ]]; then
    echo "Missing required artifact for $target" >&2
    exit 1
  fi

  gcloud storage cp --cache-control="$cache_control" "$source" "$target"
}

copy_required_download_as_source() {
  local source="$1"
  local target="$2"
  local cache_control="$3"
  local filename

  if [[ -z "$source" || ! -f "$source" ]]; then
    echo "Missing required artifact for $target" >&2
    exit 1
  fi

  filename="$(basename "$source")"
  gcloud storage cp \
    --cache-control="$cache_control" \
    --content-disposition="attachment; filename=\"$filename\"" \
    "$source" \
    "$target"
}

copy_optional() {
  local source="$1"
  local target="$2"
  local cache_control="$3"

  if [[ -n "$source" && -f "$source" ]]; then
    gcloud storage cp --cache-control="$cache_control" "$source" "$target"
  fi
}

copy_release_required() {
  local source="$1"
  local target_dir="$2"
  copy_required "$source" "$target_dir/$(basename "$source")" "$IMMUTABLE_CACHE"
}

copy_release_optional() {
  local source="$1"
  local target_dir="$2"

  if [[ -n "$source" && -f "$source" ]]; then
    copy_optional "$source" "$target_dir/$(basename "$source")" "$IMMUTABLE_CACHE"
  fi
}

WINDOWS_EXE="${WINDOWS_EXE:-$(find_one 'introscribe-Setup-*.exe')}"
WINDOWS_BLOCKMAP="${WINDOWS_BLOCKMAP:-$(find_one 'introscribe-Setup-*.exe.blockmap')}"
MAC_PKG="${MAC_PKG:-$(find_one 'introscribe-*-arm64.pkg')}"
MAC_ZIP="${MAC_ZIP:-$(find_one 'introscribe-*-arm64-mac.zip')}"
MAC_ZIP_BLOCKMAP="${MAC_ZIP_BLOCKMAP:-$(find_one 'introscribe-*-arm64-mac.zip.blockmap')}"
MAC_DMG="${MAC_DMG:-$(find_one 'introscribe-*-arm64.dmg')}"
LATEST_YML="${LATEST_YML:-$RELEASE_DIR/latest.yml}"
LATEST_MAC_YML="${LATEST_MAC_YML:-$RELEASE_DIR/latest-mac.yml}"

IMMUTABLE_CACHE="public, max-age=31536000, immutable"
LATEST_CACHE="no-cache"

copy_release_required "$WINDOWS_EXE" "$WINDOWS_DIR"
copy_release_optional "$WINDOWS_BLOCKMAP" "$WINDOWS_DIR"
copy_release_required "$MAC_PKG" "$MAC_DIR"
copy_release_required "$MAC_ZIP" "$MAC_DIR"
copy_release_optional "$MAC_ZIP_BLOCKMAP" "$MAC_DIR"
copy_release_optional "$MAC_DMG" "$MAC_DIR"

copy_required_download_as_source "$WINDOWS_EXE" "$WINDOWS_DIR/introscribe-windows.exe" "$LATEST_CACHE"
copy_required_download_as_source "$MAC_PKG" "$MAC_DIR/introscribe-mac.pkg" "$LATEST_CACHE"

copy_required "$LATEST_YML" "$WINDOWS_DIR/latest.yml" "$LATEST_CACHE"
copy_required "$LATEST_MAC_YML" "$MAC_DIR/latest-mac.yml" "$LATEST_CACHE"

echo "Published Windows downloads to $WINDOWS_DIR"
echo "Published macOS downloads to $MAC_DIR"
