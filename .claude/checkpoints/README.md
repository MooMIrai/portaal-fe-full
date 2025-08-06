# Claude Context Checkpoint System

## Come Funziona

Questo sistema crea automaticamente dei "checkpoint" (punti di salvataggio) del lavoro svolto quando Claude si avvicina al limite di contesto o quando richiesto manualmente.

### Attivazione Automatica

Il sistema si attiva automaticamente quando:
- 🔴 **8,000+ tokens** (80% del contesto) - Checkpoint automatico
- 🔴 **9,500+ tokens** (95% del contesto) - Checkpoint forzato + compressione
- 📝 **10+ file modificati** - Checkpoint di sicurezza
- ⏰ **2+ ore di lavoro** continuo
- 🎯 **Completamento feature** - Checkpoint di milestone

### Cosa Viene Salvato

Ogni checkpoint include:
1. **Riepilogo del lavoro** - Cosa è stato fatto
2. **File modificati** - Lista completa con descrizioni
3. **Decisioni chiave** - Scelte architetturali e motivazioni
4. **Stato corrente** - Come riprendere il lavoro
5. **Task pendenti** - Cosa resta da fare
6. **Problemi noti** - Bug o blocchi incontrati

## Comandi Utente

### Salvare Manualmente
```
"Crea un checkpoint"
"Salva il progresso"
"Fai un backup della sessione"
```

### Riprendere il Lavoro
```
"Continua dall'ultimo checkpoint"
"Riprendi dalla sessione precedente"
"Cosa stavamo facendo?"
```

### Verificare lo Stato
```
"Mostra l'ultimo checkpoint"
"Quali file abbiamo modificato?"
"Riassumi la sessione corrente"
```

## Esempio di Utilizzo

### Scenario 1: Checkpoint Automatico
```
[Dopo molte modifiche]
Claude: ⚠️ Mi sto avvicinando al limite di contesto (8,000+ tokens). 
        Creo un checkpoint automatico per salvare il progresso...
        
✅ Checkpoint salvato: `.claude/checkpoints/20240115_1645_timesheet-approval_partial.md`
   
Puoi continuare il lavoro in una nuova sessione con: "Continua dal checkpoint 20240115_1645"
```

### Scenario 2: Checkpoint Manuale
```
User: "Salva il progresso prima di passare alla prossima feature"

Claude: 📝 Creo un checkpoint completo della sessione corrente...

✅ Checkpoint creato con:
   - 7 file creati
   - 5 file modificati  
   - Feature timesheet approval completata al 80%
   - Prossimo task: Aggiungere export Excel
   
Il checkpoint include tutti i dettagli per riprendere il lavoro.
```

### Scenario 3: Ripresa Sessione
```
User: "Continua dal checkpoint precedente"

Claude: 📂 Carico il checkpoint più recente...

🔄 Sessione precedente (2024-01-15 16:45):
   - Stavamo lavorando su: Timesheet approval workflow in HR
   - Completato: Interfaccia manager, bulk approval, notifiche
   - Da fare: Export Excel, history view, fix performance
   - Blocker: API timeout su bulk >30 items
   
Vuoi che continui con l'export Excel o preferisci risolvere prima il problema di performance?
```

## Struttura dei File

```
.claude/checkpoints/
├── 20240115_0930_customer-crud_complete.md      # Feature completata
├── 20240115_1430_dashboard-widgets_partial.md   # In progress
├── 20240115_1645_timesheet-approval_partial.md  # Ultimo checkpoint
├── example_checkpoint.md                         # Esempio di riferimento
└── archive/                                      # Checkpoint vecchi (>30 giorni)
```

## Best Practices

### Per gli Sviluppatori

1. **Non interrompere Claude** durante la creazione di checkpoint
2. **Controlla i checkpoint** per verificare che tutto sia salvato
3. **Usa nomi descrittivi** quando richiedi checkpoint manuali
4. **Committa i session summary** importanti in Git

### Per i Team

1. **Condividi i checkpoint** delle feature complete
2. **Usa i checkpoint per handoff** tra sviluppatori
3. **Documenta decisioni importanti** nei checkpoint
4. **Revisiona periodicamente** i checkpoint archiviati

## Manutenzione

### Pulizia Automatica
```bash
# Esegui mensilmente
./claude/clean-checkpoints.sh
```

### Monitoraggio
```bash
# Controlla lo stato del sistema
./claude/monitor-context.sh
```

### Backup
```bash
# Backup dei checkpoint importanti
cp .claude/checkpoints/*_complete.md /backup/location/
```

## FAQ

**D: Cosa succede se Claude viene interrotto durante un checkpoint?**
R: Il sistema cerca di salvare almeno le informazioni essenziali. Puoi sempre richiedere un nuovo checkpoint.

**D: Posso modificare manualmente un checkpoint?**
R: Sì, sono file Markdown standard. Utile per aggiungere note post-sessione.

**D: Quanto spazio occupano i checkpoint?**
R: Circa 5-10KB ciascuno. Il sistema archivia automaticamente quelli vecchi.

**D: Posso disabilitare i checkpoint automatici?**
R: Non consigliato, ma puoi dire "non creare checkpoint automatici" all'inizio della sessione.

**D: Come faccio a trovare un checkpoint specifico?**
R: Usa: "Mostra il checkpoint del [data]" o "Cerca checkpoint sulla feature X"

---

💡 **Suggerimento**: I checkpoint sono il modo migliore per non perdere lavoro durante lunghe sessioni di sviluppo con Claude!