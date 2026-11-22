#!/bin/zsh
# Проверка пути ученика без браузера (только Mac: встроенный движок JavaScriptCore).
# Запуск из любой папки: zsh tools/tests/run.sh
# Проверяет запись (start.html), вход (login.html), диагностику, пакеты, оплату в кабинете (app.js) и что демо-доступ не сломан.
set -e
cd "$(dirname "$0")/../.."
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
TMP=$(mktemp -d)
awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' start.html > "$TMP/start-inline.js"
awk '/^<script>$/{f=1;next} /^<\/script>$/{f=0} f' login.html > "$TMP/login-inline.js"
echo "=== кабинет"; "$JSC" tools/tests/flow-test.js -- "$PWD"
echo "=== запись и вход"; "$JSC" tools/tests/pages-test.js -- "$PWD" "$TMP"
rm -rf "$TMP"
