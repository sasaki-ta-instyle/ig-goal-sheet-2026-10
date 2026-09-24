#!/bin/bash
# ig-goal-sheet-2026-10 の共有ストア（短縮 URL 発行済の JSON 群）の日次バックアップ。
# /etc/cron.daily/ に配置して root 実行を想定。30 日保持で rotate。

set -euo pipefail

SRC="/var/www/app/ig-goal-sheet-2026-10/shared/.share-store"
DEST="/var/backups/ig-goal-sheet"
KEEP_DAYS=30

mkdir -p "$DEST"

# 共有ディレクトリが未作成なら何もしない（初回発行前など）
if [ ! -d "$SRC" ]; then
  exit 0
fi

STAMP="$(date +%F)"
OUT="$DEST/${STAMP}.tar.gz"

# 空ディレクトリでも tar は成功する（0 バイト gz が出るだけ）
tar czf "$OUT" -C "$SRC" .

# 古いバックアップを削除
find "$DEST" -maxdepth 1 -name '*.tar.gz' -mtime "+${KEEP_DAYS}" -delete
