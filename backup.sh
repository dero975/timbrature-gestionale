#!/bin/bash

mkdir -p backup
timestamp=$(date "+%Y-%m-%d_%H-%M-%S")

cp admin.html backup/admin_${timestamp}.html
cp style.css backup/style_${timestamp}.css
cp script.js backup/script_${timestamp}.js

echo "✅ Backup completato: files salvati nella cartella /backup con timestamp $timestamp"

