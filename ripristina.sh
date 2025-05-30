#!/bin/bash

echo "🕘 Elenco dei backup disponibili:"
ls backup/ | grep "admin_.*\.html" | sed 's/admin_//' | sed 's/\.html//' | sort

echo ""
read -p "Inserisci il timestamp da ripristinare (es. 2025-05-28_02-00-00): " timestamp

if [[ -f backup/admin_${timestamp}.html && -f backup/style_${timestamp}.css && -f backup/script_${timestamp}.js ]]; then
  cp backup/admin_${timestamp}.html admin.html
  cp backup/style_${timestamp}.css style.css
  cp backup/script_${timestamp}.js script.js
  echo "✅ Ripristino completato da backup ${timestamp}"
else
  echo "❌ Backup non trovato. Controlla di aver digitato correttamente il timestamp."
fi

