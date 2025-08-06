import React, { useState, useMemo } from 'react';
import { Drawer } from '@progress/kendo-react-layout';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TreeView } from '@progress/kendo-react-treeview';
import { useHelp } from './HelpProvider';
import { helpContent } from './data/helpContent';
import { helpTours } from './data/helpTours';
import { HelpContent, HelpTour } from '../../types/help.types';
import { helpAnalytics } from './services/helpAnalytics';
import './HelpPanel.scss';

export const HelpPanel: React.FC = () => {
  const {
    helpPanelOpen,
    toggleHelpPanel,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    startTour
  } = useHelp();

  const [selectedContent, setSelectedContent] = useState<HelpContent | null>(null);
  const [showTours, setShowTours] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(helpContent.map(item => item.category))];
    return cats.map(cat => ({ text: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }));
  }, []);

  // Filter content based on search and category
  const filteredContent = useMemo(() => {
    let filtered = helpContent;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.searchKeywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Filter tours based on search and category
  const filteredTours = useMemo(() => {
    let filtered = helpTours;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Create tree structure for content
  const contentTree = useMemo(() => {
    const tree: any[] = [];
    const categoryGroups: { [key: string]: HelpContent[] } = {};

    filteredContent.forEach(item => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      categoryGroups[item.category].push(item);
    });

    Object.entries(categoryGroups).forEach(([category, items]) => {
      tree.push({
        id: category,
        text: category.charAt(0).toUpperCase() + category.slice(1),
        expanded: true,
        items: items.map(item => ({
          id: item.id,
          text: item.title,
          data: item
        }))
      });
    });

    return tree;
  }, [filteredContent]);

  const handleContentSelect = (event: any) => {
    const item = event.item;
    if (item.data) {
      setSelectedContent(item.data);
      setShowTours(false);
      // Track content view
      helpAnalytics.trackHelpContentView(item.data.id);
    }
  };

  const handleTourStart = (tour: HelpTour) => {
    startTour(tour.id);
    toggleHelpPanel(); // Close panel when starting tour
  };

  const renderContentView = () => {
    if (selectedContent) {
      return (
        <div className="help-content-view">
          <div className="help-content-header">
            <Button
              icon="arrow-left"
              look="flat"
              size="small"
              onClick={() => setSelectedContent(null)}
            >
              Back
            </Button>
          </div>
          <div className="help-content-body">
            <h2>{selectedContent.title}</h2>
            <div className="help-content-tags">
              {selectedContent.tags.map(tag => (
                <span key={tag} className="help-tag">{tag}</span>
              ))}
            </div>
            <div 
              className="help-content-text"
              dangerouslySetInnerHTML={{ __html: selectedContent.content }}
            />
          </div>
        </div>
      );
    }

    if (showTours) {
      return (
        <div className="help-tours-view">
          <div className="help-tours-header">
            <Button
              icon="arrow-left"
              look="flat"
              size="small"
              onClick={() => setShowTours(false)}
            >
              Back
            </Button>
            <h3>Guided Tours</h3>
          </div>
          <div className="help-tours-list">
            {filteredTours.map(tour => (
              <div key={tour.id} className="help-tour-item">
                <div className="help-tour-info">
                  <h4>{tour.name}</h4>
                  <p>{tour.description}</p>
                  <div className="help-tour-meta">
                    <span className="help-tour-steps">{tour.steps.length} steps</span>
                    <span className="help-tour-category">{tour.category}</span>
                  </div>
                </div>
                <Button
                  themeColor="primary"
                  size="small"
                  onClick={() => handleTourStart(tour)}
                >
                  Start Tour
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="help-main-view">
        <div className="help-content-tree">
          <TreeView
            data={contentTree}
            onSelect={handleContentSelect}
            expandIcons={true}
          />
        </div>
        
        <div className="help-tours-section">
          <Button
            icon="play"
            themeColor="secondary"
            onClick={() => setShowTours(true)}
            fillMode="outline"
          >
            View Guided Tours ({filteredTours.length})
          </Button>
        </div>
      </div>
    );
  };

  // Non renderizzare il Drawer se non è aperto per evitare problemi di sovrapposizione
  if (!helpPanelOpen) {
    return null;
  }

  return (
    <Drawer
      expanded={helpPanelOpen}
      position="end"
      mode="overlay"
      width={400}
      onOverlayClick={toggleHelpPanel}
    >
      <div className="help-panel">
        <div className="help-panel-header">
          <h2>Help & Documentation</h2>
          <Button
            icon="x"
            look="flat"
            size="small"
            onClick={toggleHelpPanel}
          />
        </div>

        <div className="help-panel-controls">
          <div className="help-search">
            <div className="k-textbox k-input k-input-solid k-input-md k-rounded-md" style={{ position: 'relative' }}>
              <span className="k-input-prefix">
                <i className="k-icon k-i-search" />
              </span>
              <Input
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  // Track search if query is meaningful
                  if (query.length >= 3) {
                    helpAnalytics.trackHelpSearch(query);
                  }
                }}
                placeholder="Search help content..."
                style={{ paddingLeft: '2.5em' }}
              />
            </div>
          </div>

          <div className="help-category">
            <DropDownList
              data={categories}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              textField="text"
              dataItemKey="value"
            />
          </div>
        </div>

        <div className="help-panel-content">
          {renderContentView()}
        </div>

        <div className="help-panel-footer">
          <div className="help-shortcuts">
            <small>
              <strong>Shortcuts:</strong> F1 - Help Mode, Ctrl+Shift+H - Toggle Panel
            </small>
          </div>
        </div>
      </div>
    </Drawer>
  );
};