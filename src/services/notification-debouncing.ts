// Debouncing assicura che una funzione venga eseguita solo dopo che un determinato intervallo di tempo è trascorso dall'ultimo evento.
class NotificationDebouncing {
    private timeoutId: NodeJS.Timeout | null = null;
  
    // Metodo debounce
    public debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
      return (...args: any[]) => {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          func.apply(this, args); // Mantieni il contesto di `this` qui
        }, delay);
      };
    }
  
    // Un metodo da debouncizzare
    public logMessage(message: string): void {
      console.log(`Log: ${message}`);
    }

    public setDebouncing(delay: number): (message: string) => void {
        return this.debounce(this.logMessage.bind(this), delay);
    }
  
    // Simula un evento
    public simulateEvent(): void {
      const debouncedLog = this.debounce(this.logMessage.bind(this), 2000); // `bind` per mantenere il contesto
      debouncedLog("Evento 1");
      setTimeout(() => debouncedLog("Evento 2"), 500);  // Ignorato
      setTimeout(() => debouncedLog("Evento 3"), 2500); // Ignorato
      setTimeout(() => debouncedLog("Evento 4"), 4000); // Eseguito
    }
  }
  
export const notificationDebouncing = new NotificationDebouncing();
(window as any).notificationDebouncing = notificationDebouncing;

// Esempio di utilizzo
//notificationDebouncing.simulateEvent();
  