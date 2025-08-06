import { WidgetType } from '../types/widget.types';
import { addDays, subDays, format } from 'date-fns';

export const generateSampleData = (widgetType: WidgetType): any[] => {
  const today = new Date();
  
  switch (widgetType) {
    case 'gantt':
      return [
        {
          id: 1,
          taskcategory: 'Sviluppo Frontend',
          startdate: subDays(today, 60).toISOString(),
          enddate: subDays(today, 30).toISOString(),
          description: 'Implementazione interfaccia utente',
          progress: 100,
          assignee: 'Mario Rossi'
        },
        {
          id: 2,
          taskcategory: 'Backend API',
          startdate: subDays(today, 45).toISOString(),
          enddate: subDays(today, 10).toISOString(),
          description: 'Sviluppo REST API',
          progress: 85,
          assignee: 'Laura Bianchi'
        },
        {
          id: 3,
          taskcategory: 'Testing',
          startdate: subDays(today, 20).toISOString(),
          enddate: addDays(today, 10).toISOString(),
          description: 'Test unitari e integrazione',
          progress: 40,
          assignee: 'Giuseppe Verdi'
        },
        {
          id: 4,
          taskcategory: 'Deploy',
          startdate: addDays(today, 5).toISOString(),
          enddate: addDays(today, 20).toISOString(),
          description: 'Deploy in produzione',
          progress: 0,
          assignee: 'Anna Neri'
        }
      ];

    case 'pie':
    case 'donut':
      return [
        { category: 'Sviluppo', value: 35, color: '#3498db' },
        { category: 'Design', value: 20, color: '#9b59b6' },
        { category: 'Marketing', value: 25, color: '#e74c3c' },
        { category: 'Amministrazione', value: 20, color: '#f39c12' }
      ];

    case 'bar':
      return [
        { month: 'Gennaio', vendite2024: 45000, vendite2025: 52000 },
        { month: 'Febbraio', vendite2024: 48000, vendite2025: 51000 },
        { month: 'Marzo', vendite2024: 52000, vendite2025: 58000 },
        { month: 'Aprile', vendite2024: 49000, vendite2025: 62000 },
        { month: 'Maggio', vendite2024: 55000, vendite2025: 65000 },
        { month: 'Giugno', vendite2024: 58000, vendite2025: 68000 }
      ];

    case 'line':
      return Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 30 - i);
        return {
          date: format(date, 'yyyy-MM-dd'),
          visitors: Math.floor(Math.random() * 500) + 1000,
          conversions: Math.floor(Math.random() * 50) + 30
        };
      });

    case 'area':
      return [
        { quarter: 'Q1', prodottoA: 30, prodottoB: 40, prodottoC: 20 },
        { quarter: 'Q2', prodottoA: 35, prodottoB: 45, prodottoC: 25 },
        { quarter: 'Q3', prodottoA: 40, prodottoB: 35, prodottoC: 30 },
        { quarter: 'Q4', prodottoA: 45, prodottoB: 30, prodottoC: 35 }
      ];

    case 'table':
      return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        nome: `Dipendente ${i + 1}`,
        ruolo: ['Developer', 'Designer', 'Manager', 'Analyst'][i % 4],
        dipartimento: ['IT', 'UX', 'HR', 'Finance'][i % 4],
        dataAssunzione: subDays(today, Math.floor(Math.random() * 1000)).toISOString(),
        stipendio: Math.floor(Math.random() * 30000) + 30000,
        performance: Math.floor(Math.random() * 40) + 60
      }));

    case 'kpi':
      return [{
        current: 1250000,
        previous: 980000,
        target: 1500000,
        trend: [
          { month: 'Gen', value: 950000 },
          { month: 'Feb', value: 1100000 },
          { month: 'Mar', value: 1250000 }
        ]
      }];

    case 'gauge':
      return [{
        value: 78,
        label: 'Soddisfazione Cliente'
      }];

    case 'scatter':
      return Array.from({ length: 30 }, (_, i) => ({
        experience: Math.random() * 15,
        salary: Math.random() * 50000 + 30000,
        department: ['IT', 'Sales', 'HR', 'Finance'][Math.floor(Math.random() * 4)],
        size: Math.random() * 10 + 5
      }));

    case 'heatmap':
      const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'];
      const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
      const heatmapData: any[] = [];
      
      days.forEach(day => {
        hours.forEach(hour => {
          heatmapData.push({
            day,
            hour,
            value: Math.floor(Math.random() * 100)
          });
        });
      });
      
      return heatmapData;

    case 'timeline':
      return [
        {
          date: subDays(today, 90).toISOString(),
          title: 'Lancio Progetto',
          description: 'Avvio del nuovo progetto dashboard',
          type: 'milestone',
          icon: 'fa-rocket'
        },
        {
          date: subDays(today, 60).toISOString(),
          title: 'Prima Release',
          description: 'Rilascio versione alpha',
          type: 'release',
          icon: 'fa-code-branch'
        },
        {
          date: subDays(today, 30).toISOString(),
          title: 'Feedback Utenti',
          description: 'Raccolta feedback dalla fase beta',
          type: 'feedback',
          icon: 'fa-comments'
        },
        {
          date: today.toISOString(),
          title: 'Go Live',
          description: 'Lancio in produzione',
          type: 'milestone',
          icon: 'fa-flag-checkered'
        },
        {
          date: addDays(today, 30).toISOString(),
          title: 'Fase 2',
          description: 'Nuove funzionalità pianificate',
          type: 'planned',
          icon: 'fa-calendar'
        }
      ];

    default:
      return [];
  }
};

export const generateComputedData = (widgetType: WidgetType, data: any[]): any => {
  switch (widgetType) {
    case 'gantt':
      const dates = data.flatMap(item => [
        new Date(item.startdate),
        new Date(item.enddate)
      ]);
      return {
        categories: [...new Set(data.map(item => item.taskcategory))],
        dateRange: {
          min: new Date(Math.min(...dates.map(d => d.getTime()))).toISOString(),
          max: new Date(Math.max(...dates.map(d => d.getTime()))).toISOString()
        },
        summary: {
          totalTasks: data.length,
          averageProgress: data.reduce((sum, task) => sum + (task.progress || 0), 0) / data.length,
          completedTasks: data.filter(task => task.progress === 100).length
        }
      };

    case 'pie':
    case 'donut':
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const largest = [...data].sort((a, b) => b.value - a.value)[0];
      return {
        total,
        largest: {
          category: largest.category,
          value: largest.value
        }
      };

    case 'bar':
    case 'line':
    case 'area':
      const values = data.flatMap(item => 
        Object.keys(item)
          .filter(key => typeof item[key] === 'number')
          .map(key => item[key])
      );
      return {
        min: Math.min(...values),
        max: Math.max(...values),
        average: values.reduce((a, b) => a + b, 0) / values.length
      };

    default:
      return {};
  }
};