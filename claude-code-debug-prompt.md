# Istruzioni per Claude Code - Debug Applicazione con Playwright

## Contesto
Sto lavorando in `/home/mverde/src/taal/portaal-fe-full` su Ubuntu 24.04. Ho Playwright installato e configurato. WebKit ha problemi su questo sistema, quindi **usa sempre Chromium** per tutti i test e debug.

## Quando ti chiedo di fare debug dell'applicazione:

### 1. Avvia sempre il debug con Chromium
```bash
# USA SEMPRE --project=chromium perché WebKit non funziona
PWDEBUG=1 npx playwright test --project=chromium
```

### 2. Per debug di test specifici
```bash
# Se devo debuggare un test specifico
PWDEBUG=1 npx playwright test e2e/[nome-file].spec.ts --project=chromium

# O per nome del test
PWDEBUG=1 npx playwright test -g "nome del test" --project=chromium
```

### 3. Modalità di debug disponibili

**Debug Interattivo (Playwright Inspector)**:
- Usa `PWDEBUG=1` per aprire il Playwright Inspector
- Permette step-by-step, pick locator, e recording

**Debug Visuale (Headed + Slowmo)**:
```bash
npx playwright test --project=chromium --headed --slowmo=1000
```
- Mostra il browser
- Rallenta le azioni per vederle meglio

**Debug con Pause nel codice**:
- Aggiungi `await page.pause();` dove vuoi fermarti
- Utile per ispezionare lo stato in punti specifici

### 4. Quando generi nuovi test

Se devi creare test per la mia applicazione:
1. Usa sempre `--project=chromium` nella configurazione
2. Includi sempre gestione errori e screenshot su fallimento
3. Usa localizzatori robusti (preferisci `getByRole`, `getByText`, `getByTestId`)

### 5. Esempio di test ben strutturato per debug

```typescript
import { test, expect } from '@playwright/test';

test.describe('Nome Feature', () => {
  test('descrizione test', async ({ page }) => {
    // Naviga alla pagina
    await page.goto('https://esempio.com');
    
    // Screenshot iniziale per debug
    await page.screenshot({ path: 'screenshots/initial.png' });
    
    // Azioni con attese esplicite
    await page.waitForLoadState('networkidle');
    
    // Log per debug
    console.log('URL corrente:', page.url());
    
    // Breakpoint manuale se necessario
    // await page.pause();
    
    // Asserzioni con messaggi chiari
    await expect(page.locator('h1')).toContainText('Titolo Atteso');
  });
});
```

### 6. Comandi utili durante il debug

- **Screenshot**: `await page.screenshot({ path: 'debug.png' })`
- **Log HTML**: `console.log(await page.content())`
- **Ispeziona elemento**: `await page.locator('selector').evaluate(el => console.log(el))`
- **Aspetta condizione**: `await page.waitForSelector('selector', { state: 'visible' })`

### 7. Report e analisi

Dopo i test:
```bash
# Mostra report HTML
npx playwright show-report

# Mostra trace (se abilitato)
npx playwright show-trace trace.zip
```

## Ricorda sempre:
- **MAI usare WebKit** - dà errori su Ubuntu 24.04
- **Chromium è perfetto** per tutto
- **Aggiungi log e screenshot** nei punti critici
- **Usa headed mode** quando devo vedere cosa succede visivamente

## Se ti chiedo di debuggare un problema specifico:
1. Prima esegui il test in headed mode con slowmo per vedere il problema
2. Poi usa PWDEBUG=1 per analizzare step by step
3. Aggiungi log e screenshot nei punti sospetti
4. Genera un report dettagliato del problema trovato