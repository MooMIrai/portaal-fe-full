// Throttling limita il numero di volte in cui una funzione viene eseguita in un determinato intervallo di tempo, ignorando gli eventi in eccesso.
class NotificationThrottling {

    private lastCall: number = 0;
    private timeoutId: NodeJS.Timeout | null = null;
  
    // Metodo throttle
    public throttle(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
      return (...args: any[]) => {
        const now = Date.now();
        const remainingTime = delay - (now - this.lastCall);
  
        if (remainingTime <= 0) {
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
          }
          this.lastCall = now;
          func.apply(this, args); // Mantieni il contesto di `this` qui
        } else if (!this.timeoutId) {
          this.timeoutId = setTimeout(() => {
            this.lastCall = Date.now();
            this.timeoutId = null;
            func.apply(this, args); // Mantieni il contesto di `this` qui
          }, remainingTime);
        }
      };
    }
  
    // Un metodo da throttlere
    public logMessage(message: string): void {
      console.log(`Log: ${message}`);
    }
  
    // Simula un evento
    public simulateEvent(): void {
      const throttledLog = this.throttle(this.logMessage.bind(this), 2000); // `bind` per assicurare `this`
      throttledLog("Evento 1");
      setTimeout(() => throttledLog("Evento 2"), 500); // Questo verrà ignorato
      setTimeout(() => throttledLog("Evento 3"), 2500); // Questo verrà eseguito
    }
  }

export const notificationThrottling = new NotificationThrottling();
(window as any).notificationThrottling = notificationThrottling;

// Esempio di utilizzo
//notificationThrottling.simulateEvent();
  