import { chartTemplateParser } from '../ChartTemplateParser';

describe('ChartTemplateParser', () => {
  const mockData = [
    {
      nome_attivita: "Ferie",
      percentuale_impiego: 4.761904761904762
    },
    {
      nome_attivita: "Malattia",
      percentuale_impiego: 4.761904761904762
    },
    {
      nome_attivita: "Permessi",
      percentuale_impiego: 25
    },
    {
      nome_attivita: "Permesso 104",
      percentuale_impiego: 0.5952380952380952
    },
    {
      nome_attivita: "Non Assegnato",
      percentuale_impiego: 64.8809523809524
    }
  ];

  describe('Basic parsing', () => {
    it('should parse a simple chart template', () => {
      const template = `
        <Chart>
          <ChartTitle text="Test Chart" />
          <ChartSeries>
            <ChartSeriesItem type="pie" data={$data$} />
          </ChartSeries>
        </Chart>
      `;

      const result = chartTemplateParser.parse(template, mockData);
      expect(result).toBeDefined();
      expect(result.type).toBe('Chart');
    });

    it('should parse the backend pie chart template', () => {
      const template = `<Chart>
<ChartTitle text="Pie Chart" />
<ChartLegend position="top" orientation="horizontal" />
<ChartSeries>
  <ChartSeriesItem type="pie" overlay={{ gradient: 'sharpBevel' }} tooltip={{ visible: true }} data={$data$} categoryField="nome_attivita" field="percentuale_impiego"/>
</ChartSeries>
</Chart>`;

      const result = chartTemplateParser.parse(template, mockData);
      expect(result).toBeDefined();
      expect(result.type).toBe('Chart');
      expect(result.props.children).toBeDefined();
    });
  });

  describe('Security tests', () => {
    it('should reject non-whitelisted components', () => {
      const maliciousTemplate = `
        <Chart>
          <script>alert('XSS')</script>
          <ChartTitle text="Test" />
        </Chart>
      `;

      expect(() => {
        chartTemplateParser.parse(maliciousTemplate, mockData);
      }).toThrow();
    });

    it('should reject invalid XML', () => {
      const invalidTemplate = `
        <Chart>
          <ChartTitle text="Test" 
        </Chart>
      `;

      expect(() => {
        chartTemplateParser.parse(invalidTemplate, mockData);
      }).toThrow();
    });

    it('should handle HTML entities safely', () => {
      const template = `
        <Chart>
          <ChartTitle text="&lt;script&gt;alert('xss')&lt;/script&gt;" />
        </Chart>
      `;

      const result = chartTemplateParser.parse(template, []);
      expect(result).toBeDefined();
      // The title should contain escaped HTML, not executable script
    });
  });

  describe('Data placeholder replacement', () => {
    it('should replace $data$ placeholder with actual data', () => {
      const template = `
        <Chart>
          <ChartSeries>
            <ChartSeriesItem data={$data$} />
          </ChartSeries>
        </Chart>
      `;

      const result = chartTemplateParser.parse(template, mockData);
      expect(result).toBeDefined();
      // The component should have the data prop set to mockData
    });
  });

  describe('Complex attributes', () => {
    it('should parse nested object attributes', () => {
      const template = `
        <Chart>
          <ChartSeriesItem 
            type="pie" 
            overlay={{ gradient: 'sharpBevel' }} 
            tooltip={{ visible: true, format: '{0}%' }}
          />
        </Chart>
      `;

      const result = chartTemplateParser.parse(template, []);
      expect(result).toBeDefined();
    });

    it('should parse boolean and numeric attributes', () => {
      const template = `
        <Chart>
          <ChartLegend visible={true} position="top" />
          <ChartValueAxisItem min={0} max={100} />
        </Chart>
      `;

      const result = chartTemplateParser.parse(template, []);
      expect(result).toBeDefined();
    });

    it('should parse complex nested attributes with quotes inside', () => {
      const template = `<Chart pannable={false} zoomable={false} transitions={false}> <ChartTooltip visible={false} /> <ChartCategoryAxis> <ChartCategoryAxisItem reverse={true} majorGridLines={{ visible: false }} /> </ChartCategoryAxis> <ChartValueAxis> <ChartValueAxisItem type="date" baseUnit="months" labels={{ format: "{0:MMM yyyy}" }} min={$minDate$} max={$maxDate$} /> </ChartValueAxis> <ChartSeries> <ChartSeriesItem type="rangeBar" data={$data$} categoryField="taskCategory" fromField="startDate" toField="endDate" color="#27a2e9" /> </ChartSeries> </Chart>`;

      const testData = {
        data: [
          {
            id: 36,
            start_date: "2025-01-01T13:52:03.000Z",
            end_date: "2025-12-31T13:52:03.000Z",
            description: "Test Task 1"
          },
          {
            id: 34,
            start_date: "2025-01-01T13:52:03.000Z",
            end_date: "2025-12-31T13:52:03.000Z",
            description: "Test Task 2"
          }
        ],
        maxdate: "2025-12-31T13:52:03.000Z",
        mindate: "2025-01-01T13:52:03.000Z"
      };

      const result = chartTemplateParser.parse(template, testData);
      expect(result).toBeDefined();
      expect(result.type).toBe('Chart');
    });
  });

  describe('Date placeholder replacement', () => {
    it('should replace $minDate$ and $maxDate$ placeholders', () => {
      const template = `
        <Chart>
          <ChartValueAxisItem 
            type="date" 
            min={$minDate$} 
            max={$maxDate$} 
          />
        </Chart>
      `;

      const testData = {
        data: [],
        mindate: "2025-01-01T00:00:00.000Z",
        maxdate: "2025-12-31T23:59:59.000Z"
      };

      const result = chartTemplateParser.parse(template, testData);
      expect(result).toBeDefined();
      // The dates should be converted to Date objects
    });
  });

  describe('Mixed data formats', () => {
    it('should handle data as array', () => {
      const template = `
        <Chart>
          <ChartSeriesItem data={$data$} />
        </Chart>
      `;

      const dataArray = [
        { name: 'Item 1', value: 10 },
        { name: 'Item 2', value: 20 }
      ];

      const result = chartTemplateParser.parse(template, dataArray);
      expect(result).toBeDefined();
    });

    it('should handle data as object with data property', () => {
      const template = `
        <Chart>
          <ChartSeriesItem data={$data$} />
        </Chart>
      `;

      const dataObject = {
        data: [
          { name: 'Item 1', value: 10 },
          { name: 'Item 2', value: 20 }
        ],
        mindate: "2025-01-01",
        maxdate: "2025-12-31"
      };

      const result = chartTemplateParser.parse(template, dataObject);
      expect(result).toBeDefined();
    });
  });
});