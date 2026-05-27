import { useState, useCallback, useRef } from 'react';

const MAX_VERSIONS = 30;

function generateVersionName(nodes) {
  if (nodes.length === 0) return 'Diagramma vuoto';
  const providers = [...new Set(nodes.map(n => {
    if (n.serviceId?.startsWith('aws')) return 'AWS';
    if (n.serviceId?.startsWith('az')) return 'Azure';
    if (n.serviceId?.startsWith('gcp')) return 'GCP';
    return null;
  }).filter(Boolean))];
  const providerStr = providers.length > 0 ? providers.join('+') : '';
  return `${providerStr ? providerStr + ' · ' : ''}${nodes.length} componenti`;
}

export default function useVersioning(nodes, arrows, groups) {
  const [versions, setVersions] = useState([]); // [{id, name, timestamp, nodes, arrows, groups}]
  const lastSavedRef = useRef(null);

  const saveVersion = useCallback((customName = null) => {
    const snapshot = { nodes, arrows, groups };
    const snapshotStr = JSON.stringify(snapshot);

    // Avoid saving identical state
    if (lastSavedRef.current === snapshotStr) return null;
    lastSavedRef.current = snapshotStr;

    const version = {
      id: `v_${Date.now()}`,
      name: customName || generateVersionName(nodes),
      timestamp: new Date().toISOString(),
      nodes: JSON.parse(JSON.stringify(nodes)),
      arrows: JSON.parse(JSON.stringify(arrows)),
      groups: JSON.parse(JSON.stringify(groups)),
    };

    setVersions(prev => [version, ...prev].slice(0, MAX_VERSIONS));
    return version.id;
  }, [nodes, arrows, groups]);

  const restoreVersion = useCallback((versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return null;
    return {
      nodes: JSON.parse(JSON.stringify(version.nodes)),
      arrows: JSON.parse(JSON.stringify(version.arrows)),
      groups: JSON.parse(JSON.stringify(version.groups)),
    };
  }, [versions]);

  const deleteVersion = useCallback((versionId) => {
    setVersions(prev => prev.filter(v => v.id !== versionId));
  }, []);

  const renameVersion = useCallback((versionId, newName) => {
    setVersions(prev => prev.map(v => v.id === versionId ? { ...v, name: newName } : v));
  }, []);

  return { versions, saveVersion, restoreVersion, deleteVersion, renameVersion };
}