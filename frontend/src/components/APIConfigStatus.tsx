/**
 * 🔧 API Configuration Status Component
 * 
 * Displays the current status of external API configurations
 * and provides guidance for setup if needed.
 */

'use client';

import React, { useState, useEffect } from 'react';

interface APIStatus {
  name: string;
  key_name: string;
  configured: boolean;
  description: string;
  docs_url: string;
}

interface APIStatusData {
  summary: {
    total_apis: number;
    configured_count: number;
    critical_missing: number;
    high_missing: number;
    configuration_level: string;
  };
  apis_by_priority: {
    critical: APIStatus[];
    high: APIStatus[];
    medium: APIStatus[];
    low: APIStatus[];
  };
  issues: {
    errors: string[];
    warnings: string[];
  };
}

export default function APIConfigurationStatus() {
  const [apiStatus, setApiStatus] = useState<APIStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAPIs, setShowAllAPIs] = useState(false);

  const fetchAPIStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/api/config/apis/status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API status: ${response.statusText}`);
      }
      
      const data = await response.json();
      setApiStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API status');
      console.error('Error fetching API status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIStatus();
  }, []);

  const getStatusColor = (configured: boolean, priority: string) => {
    if (configured) return 'bg-green-500';
    if (priority === 'critical') return 'bg-red-500';
    if (priority === 'high') return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getStatusText = (configured: boolean) => {
    return configured ? 'Configured' : 'Missing';
  };

  const renderAPIList = (apis: APIStatus[], priority: string, title: string) => {
    if (apis.length === 0) return null;

    const configuredCount = apis.filter(api => api.configured).length;
    const totalCount = apis.length;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title} APIs</h3>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
            {configuredCount}/{totalCount}
          </span>
        </div>
        <div className="space-y-3">
          {apis.map((api) => (
            <div
              key={api.key_name}
              className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(api.configured, priority)}`} />
                <div>
                  <p className="font-medium text-sm">{api.name}</p>
                  <p className="text-xs text-gray-600">{api.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    api.configured 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {getStatusText(api.configured)}
                </span>
                <a 
                  href={api.docs_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  title="View documentation"
                >
                  📖
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Loading API configuration status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 text-red-600 mb-3">
          <span>⚠️</span>
          <span>Error loading API status: {error}</span>
        </div>
        <button 
          onClick={fetchAPIStatus} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!apiStatus) {
    return null;
  }

  const { summary, apis_by_priority, issues } = apiStatus;
  const configurationPercentage = Math.round((summary.configured_count / summary.total_apis) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <span>⚙️</span>
            <span>API Configuration Status</span>
          </h2>
          <button 
            onClick={fetchAPIStatus} 
            className="text-gray-600 hover:text-gray-800 p-2"
            title="Refresh"
          >
            🔄
          </button>
        </div>

        <div className="space-y-4">
          {/* Progress Overview */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Configuration Progress</span>
              <span>{summary.configured_count}/{summary.total_apis} APIs configured</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  configurationPercentage === 100 ? 'bg-green-500' : 
                  configurationPercentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${configurationPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {configurationPercentage}% complete
            </p>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {summary.critical_missing === 0 ? '✅' : '❌'}
              </span>
              <span className="text-sm">
                Critical APIs: {summary.critical_missing === 0 ? 'Complete' : `${summary.critical_missing} missing`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">ℹ️</span>
              <span className="text-sm">
                Configuration: {summary.configuration_level}
              </span>
            </div>
          </div>

          {/* Issues */}
          {(issues.errors.length > 0 || issues.warnings.length > 0) && (
            <div className="space-y-2">
              {issues.errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-red-600 text-sm">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              ))}
              {issues.warnings.map((warning, index) => (
                <div key={index} className="flex items-center space-x-2 text-orange-600 text-sm">
                  <span>⚠️</span>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Critical APIs */}
      {renderAPIList(apis_by_priority.critical, 'critical', 'Critical')}

      {/* High Priority APIs */}
      {renderAPIList(apis_by_priority.high, 'high', 'High Priority')}

      {/* Show More/Less Button */}
      <div className="text-center">
        <button
          onClick={() => setShowAllAPIs(!showAllAPIs)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm"
        >
          {showAllAPIs ? 'Show Less' : 'Show All APIs'}
        </button>
      </div>

      {/* Medium and Low Priority APIs (collapsible) */}
      {showAllAPIs && (
        <>
          {renderAPIList(apis_by_priority.medium, 'medium', 'Medium Priority')}
          {renderAPIList(apis_by_priority.low, 'low', 'Optional')}
        </>
      )}

      {/* Setup Instructions */}
      {summary.critical_missing > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-orange-800 font-semibold mb-3">Setup Required</h3>
          <div className="space-y-2 text-sm text-orange-700">
            <p>To get started with LocationIQ Pro:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Edit <code className="bg-orange-100 px-1 rounded">api_keys_config.env</code> in the project root</li>
              <li>Add your API keys (see links above for registration)</li>
              <li>Run <code className="bg-orange-100 px-1 rounded">python setup_api_keys.py</code></li>
              <li>Restart the application</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
