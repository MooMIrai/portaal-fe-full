import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { plusIcon, editIcon, deleteIcon, copyIcon } from '@progress/kendo-svg-icons';
import { useNavigate } from 'react-router-dom';
import { WidgetTemplate } from '../../types/widget.types';
import { WIDGET_INFO, WIDGET_CATEGORIES } from '../../constants';
// Temporaneamente disabilitiamo i componenti comuni per evitare errori
// import Loader from 'common/Loader';
// import Modal from 'common/Modal';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // TODO: Caricare template da API
      // Simulazione caricamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dati di esempio
      const mockTemplates: WidgetTemplate[] = [
        {
          id: '1',
          name: 'Gantt Progetti Attivi',
          description: 'Timeline dei progetti in corso',
          widgetType: 'gantt',
          config: {
            title: 'Progetti Attivi',
            categoryField: 'projectName',
            fromField: 'startDate',
            toField: 'endDate'
          },
          category: 'Project Management',
          tags: ['progetti', 'timeline', 'gantt'],
          isPublic: true,
          createdBy: 'admin',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'KPI Vendite Mensili',
          description: 'Indicatore vendite del mese corrente',
          widgetType: 'kpi',
          config: {
            title: 'Vendite Mensili',
            valueField: 'totalSales',
            format: '€ {0:n0}',
            icon: 'fas fa-euro-sign'
          },
          category: 'Sales',
          tags: ['vendite', 'kpi', 'metriche'],
          isPublic: true,
          createdBy: 'admin',
          createdAt: '2024-01-10'
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('..');
  };

  const handleEdit = (template: WidgetTemplate) => {
    // TODO: Navigare all'editor con template precaricato
    navigate('..', { state: { template } });
  };

  const handleDuplicate = async (template: WidgetTemplate) => {
    try {
      // TODO: Duplicare template via API
      console.log('Duplicating template:', template);
      await loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    
    try {
      // TODO: Eliminare template via API
      console.log('Deleting template:', selectedTemplate);
      setShowDeleteModal(false);
      setSelectedTemplate(null);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Tutte le categorie' },
    ...Object.values(WIDGET_CATEGORIES).map(cat => ({ value: cat, label: cat }))
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Template Widget</h1>
            <Button
              primary
              icon={plusIcon}
              onClick={handleCreateNew}
            >
              Crea Nuovo Template
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {/* Filtri */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Cerca template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.value || '')}
              className="flex-1"
            />
            <DropDownList
              data={categories}
              textField="label"
              dataItemKey="value"
              value={categories.find(c => c.value === selectedCategory)}
              onChange={(e) => setSelectedCategory(e.value?.value || 'all')}
              style={{ width: '200px' }}
            />
          </div>

          {/* Grid Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        fillMode="flat"
                        icon={editIcon}
                        onClick={() => handleEdit(template)}
                        title="Modifica"
                      />
                      <Button
                        fillMode="flat"
                        icon={copyIcon}
                        onClick={() => handleDuplicate(template)}
                        title="Duplica"
                      />
                      <Button
                        fillMode="flat"
                        icon={deleteIcon}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowDeleteModal(true);
                        }}
                        title="Elimina"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 bg-primary rounded" />
                      {WIDGET_INFO[template.widgetType as keyof typeof WIDGET_INFO]?.name}
                    </span>
                    <span>{template.createdAt}</span>
                  </div>

                  {template.tags && template.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Nessun template trovato</p>
              <Button
                primary
                className="mt-4"
                onClick={handleCreateNew}
              >
                Crea il primo template
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal di conferma eliminazione - implementazione semplice */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <h3 className="text-lg font-medium">Conferma eliminazione</h3>
            </CardHeader>
            <CardBody>
              <p>Sei sicuro di voler eliminare il template "{selectedTemplate?.name}"?</p>
              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={() => setShowDeleteModal(false)}>
                  Annulla
                </Button>
                <Button themeColor="error" onClick={handleDelete}>
                  Elimina
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;