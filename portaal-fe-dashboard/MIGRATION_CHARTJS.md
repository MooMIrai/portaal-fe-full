# Migrazione da KendoReact Charts a Chart.js

## Data: 2025-08-02

## Descrizione
Questo documento elenca tutti i file modificati durante la migrazione da KendoReact Charts a Chart.js nella dashboard, con i percorsi dei file di backup per un eventuale ripristino.

## Modifiche Effettuate

### 1. Installazione dipendenze
- Aggiunte le dipendenze `chart.js` e `react-chartjs-2` al package.json

### 2. File Modificati e Backup

#### Componenti Widget Base
| File Originale | File di Backup |
|----------------|----------------|
| `src/components/widgets/BarChart.tsx` | `backup/widgets/BarChart.tsx.backup` |
| `src/components/widgets/LineChart.tsx` | `backup/widgets/LineChart.tsx.backup` |
| `src/components/widgets/PieChart.tsx` | `backup/widgets/PieChart.tsx.backup` |
| `src/components/widgets/DonutChart.tsx` | `backup/widgets/DonutChart.tsx.backup` |
| `src/components/widgets/AreaChart.tsx` | `backup/widgets/AreaChart.tsx.backup` |

#### Componenti Widget Strutturati
| File Originale | File di Backup |
|----------------|----------------|
| `src/components/widgets/structured/BarWidget.tsx` | `backup/widgets/BarWidget.tsx.backup` |
| `src/components/widgets/structured/LineWidget.tsx` | `backup/widgets/LineWidget.tsx.backup` |
| `src/components/widgets/structured/PieWidget.tsx` | `backup/widgets/PieWidget.tsx.backup` |
| `src/components/widgets/structured/DonutWidget.tsx` | `backup/widgets/DonutWidget.tsx.backup` |
| `src/components/widgets/structured/AreaWidget.tsx` | `backup/widgets/AreaWidget.tsx.backup` |

#### Altri File
| File Originale | File di Backup |
|----------------|----------------|
| `src/services/chartTemplate/ChartTemplateParser.ts` | `backup/services/chartTemplate/ChartTemplateParser.ts.backup` |
| `src/components/widgets/structured/KPIWidget.tsx` | `backup/widgets/KPIWidget.tsx.backup` |
| `src/components/widgets/structured/GanttWidget.tsx` | `backup/widgets/GanttWidget.tsx.backup` |
| `src/components/widgets/GanttChart.tsx` | `backup/widgets/GanttChart.tsx.backup` |

#### Nuovi File Creati
- `src/components/widgets/HtmlChartWidget.tsx` - Nuovo componente per gestire i grafici HTML inviati dal backend

#### File Modificati senza Backup Necessario
- `src/components/dashboard/WidgetRenderer/index.tsx` - Aggiunto import e supporto per HtmlChartWidget
- `src/bootstrap.tsx` - Aggiunta registrazione globale di Chart.js

## Note di Implementazione

### Cambiamenti Principali
1. **Sostituiti tutti gli import KendoReact Charts** con import da Chart.js e react-chartjs-2
2. **Registrazione globale di Chart.js** - Chart.js viene registrato globalmente in bootstrap.tsx per supportare gli script HTML dal backend
3. **Conversione della struttura dati** - Adattata la struttura dati da KendoReact a Chart.js
4. **Gestione opzioni** - Convertite le opzioni di configurazione al formato Chart.js
5. **Nuovo componente HtmlChartWidget** - Creato per gestire i grafici HTML con tag `<canvas>` inviati dal backend
6. **Grafici Gantt non supportati** - Chart.js non supporta nativamente i grafici Gantt/rangeBar, quindi sono stati sostituiti con placeholder

### Funzionalità Mantenute
- Supporto per tooltip personalizzati
- Configurazione assi X e Y
- Legende configurabili
- Colori personalizzabili
- Formattazione valori
- Grafici multipli (serie multiple)
- Responsive design

### Differenze da Considerare
1. **Sintassi Template**: KendoReact usa `#= expression #`, Chart.js richiede funzioni callback
2. **Gestione Eventi**: Chart.js usa un approccio diverso per gli eventi
3. **Animazioni**: Le animazioni di default sono diverse tra le due librerie
4. **Performance**: Chart.js potrebbe comportarsi diversamente con grandi dataset

## Come Ripristinare

Per ripristinare i file originali con KendoReact:

```bash
# Dalla directory portaal-fe-dashboard
cp backup/widgets/*.backup src/components/widgets/
cp backup/services/chartTemplate/*.backup src/services/chartTemplate/

# Rimuovere l'estensione .backup dai file
cd src/components/widgets/
for file in *.backup; do mv "$file" "${file%.backup}"; done

# Rimuovere Chart.js dalle dipendenze
yarn remove chart.js react-chartjs-2

# Rimuovere il nuovo componente
rm src/components/widgets/HtmlChartWidget.tsx

# Ripristinare WidgetRenderer alle modifiche precedenti
```

## Test Consigliati
1. Verificare che tutti i tipi di grafico si visualizzino correttamente
2. Testare i tooltip personalizzati
3. Verificare la responsività dei grafici
4. Controllare le performance con dataset grandi
5. Testare i grafici HTML inviati dal backend nel formato mostrato nell'esempio

## Sistema di Placeholder

### Descrizione
È stato implementato un sistema di placeholder per permettere al backend di inviare configurazioni Chart.js con riferimenti dinamici ai dati invece di valori hardcodati.

### File Implementati
- `src/utils/placeholderProcessor.ts` - Modulo per processare i placeholder
- Modificato `src/components/widgets/HtmlChartWidget.tsx` per utilizzare il processore

### Sintassi Supportata

#### 1. Array Mapping
Estrae un campo da tutti gli elementi di un array:
```
{{Query.*.month}}     // ["January", "April", "May"]
{{Query.*.amount}}    // [1200, 4500, 3200]
```

#### 2. Aggregazioni
Calcola valori aggregati su array:
```
{{Query.sum(amount)}}   // Somma di tutti gli amount
{{Query.avg(amount)}}   // Media degli amount
{{Query.min(amount)}}   // Valore minimo
{{Query.max(amount)}}   // Valore massimo
{{Query.count()}}       // Numero di elementi
```

#### 3. Filtri
Filtra array basandosi su condizioni:
```
{{Query[status=active].*.name}}    // Solo elementi con status=active
{{Query[type=sales].sum(amount)}}  // Somma amount dove type=sales
```

#### 4. Proprietà Nested
Accesso a proprietà annidate:
```
{{Query.*.details.price}}          // Accede a details.price per ogni elemento
{{Query.0.customer.name}}          // Nome del cliente del primo elemento
```

#### 5. Trasformazioni
Applica trasformazioni ai valori:
```
{{Query.*.date|format:MMM}}        // Formatta date come "Jan", "Feb", etc.
{{Query.*.amount|currency:EUR}}    // Formatta come valuta EUR
{{Query.*.name|uppercase}}         // Converte in maiuscolo
{{Query.*.code|lowercase}}         // Converte in minuscolo
```

### Esempio di Utilizzo

**Backend invia:**
```json
{
  "Query": [
    { "month": "April", "amount": 4500 },
    { "month": "May", "amount": 3200 },
    { "month": "July", "amount": 2800 }
  ],
  "chart": "<canvas id='salesChart'></canvas><script>new Chart(document.getElementById('salesChart'), { type: 'bar', data: { labels: {{Query.*.month}}, datasets: [{ label: 'Vendite Mensili', data: {{Query.*.amount}}, backgroundColor: 'rgba(75, 192, 192, 0.6)' }] }, options: { plugins: { title: { display: true, text: 'Totale Vendite: €{{Query.sum(amount)|currency:EUR}}' } } } });</script>"
}
```

**Risultato processato:**
```javascript
new Chart(document.getElementById('salesChart'), {
  type: 'bar',
  data: {
    labels: ["April", "May", "July"],
    datasets: [{
      label: 'Vendite Mensili',
      data: [4500, 3200, 2800],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Totale Vendite: €10.500,00'
      }
    }
  }
});
```

### Vantaggi del Sistema
1. **Flessibilità**: Il backend può definire template riutilizzabili
2. **Manutenibilità**: Separazione tra logica di presentazione e dati
3. **Performance**: I dati vengono processati solo quando necessario
4. **Sicurezza**: Nessun eval() diretto di dati utente