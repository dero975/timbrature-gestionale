#!/bin/bash

read -p "Quanti backup più recenti vuoi conservare? " numero

# Trova i backup HTML ordinati dal più vecchio
backup_html=$(ls -1t backup/admin_*.html)

# Conta quanti backup esistono
totale=$(echo "$backup_html" | wc -l)

# Calcola quanti devono essere eliminati
da_eliminare=$((totale - numero))

if [ $da_eliminare -le 0 ]; then
  echo "✅ Hai già $totale backup o meno. Nessun file eliminato."
  exit 0
fi

# Elimina i più vecchi
echo "$backup_html" | tail -n $da_eliminare | while read file_html; do
  timestamp=$(echo "$file_html" | sed 's/backup\/admin_//' | sed 's/.html//')
  echo "🗑️  Eliminazione backup $timestamp..."
  rm -f "backup/admin_${timestamp}.html"
  rm -f "backup/style_${timestamp}.css"
  rm -f "backup/script_${timestamp}.js"
done

echo "✅ Pulizia completata. Conservati solo gli ultimi $numero backup."

