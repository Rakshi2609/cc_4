import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Flame, Layers, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = {
  pending: '#da1e28', // flat red
  'in-progress': '#f59e0b', // flat amber
  resolved: '#198038', // flat green
};

const STATUS_LABEL = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
};

// Auto-fit map to markers
function AutoFit({ issues }) {
  const map = useMap();
  useEffect(() => {
    const valid = issues.filter((i) => Array.isArray(i.location?.coordinates) && i.location.coordinates.length >= 2 && i.location.coordinates[0] != null);
    if (valid.length === 0) return;
    const bounds = valid.map((i) => [Number(i.location.coordinates[1]), Number(i.location.coordinates[0])]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [issues, map]);
  return null;
}

export default function IssueMap({ issues = [], title = 'Issue Heatmap', readOnly = false }) {
  const navigate = useNavigate();
  const validIssues = issues.filter((i) => Array.isArray(i.location?.coordinates) && i.location.coordinates.length >= 2 && i.location.coordinates[0] != null && i.location.coordinates[1] != null);
  const [heatmapOn, setHeatmapOn] = useState(false);

  // Default center — India centroid  
  const defaultCenter = [20.5937, 78.9629];

  if (validIssues.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p className="mono text-[11px] text-gray-400 tracking-widest">NO_LOCATION_DATA</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 flex-shrink-0 bg-white">
        <span className="mono text-[11px] text-gray-500 tracking-widest">{title}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHeatmapOn((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-sm mono text-[10px] font-semibold border transition tracking-wide ${heatmapOn
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
          >
            <Layers size={11} />
            {heatmapOn ? 'HEATMAP ON' : 'HEATMAP'}
          </button>
          <div className="flex items-center gap-3">
            {Object.entries(STATUS_COLOR).map(([k, color]) => (
              <span key={k} className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="mono text-[9px] text-gray-400 tracking-wide uppercase">{k}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapContainer
          center={defaultCenter}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoFit issues={validIssues} />

          {heatmapOn && validIssues.map((issue) => {
            const lng = Number(issue.location.coordinates[0]);
            const lat = Number(issue.location.coordinates[1]);
            const risk = (issue.upvotes || 0) + (issue.clusterMembers?.length || 0) * 2;
            const radius = 20 + Math.min(risk * 4, 60);
            const opacity = 0.10 + Math.min(risk * 0.03, 0.30);
            const color = risk > 8 ? '#da1e28' : risk > 4 ? '#f59e0b' : '#0f62fe';
            return (
              <CircleMarker
                key={`heat-${issue._id}`}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{ color, fillColor: color, fillOpacity: opacity, weight: 0 }}
              />
            );
          })}

          {validIssues.map((issue) => {
            const lng = Number(issue.location.coordinates[0]);
            const lat = Number(issue.location.coordinates[1]);
            const isClusterPrimary = issue.isCluster && !issue.clusterId;
            const isClusterMember = !!issue.clusterId;
            const memberCount = issue.clusterMembers?.length || 0;

            let color = STATUS_COLOR[issue.status] || '#6b7280';
            let borderColor = color;
            let radius = 10;
            let weight = 2;

            if (isClusterPrimary) {
              color = '#f59e0b';       // flat amber cluster primary
              borderColor = '#ffffff'; // crisp white border
              radius = 14 + Math.min(memberCount * 2, 12);
              weight = 3;
            } else if (isClusterMember) {
              borderColor = '#f59e0b';
              weight = 2;
              radius = 8;
            }

            return (
              <CircleMarker
                key={issue._id}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{ color: borderColor, fillColor: color, fillOpacity: 0.85, weight }}
                eventHandlers={!readOnly ? { click: () => navigate(`/issues/${issue._id}`) } : {}}
              >
                <Popup>
                  <div style={{ background: '#ffffff', borderRadius: 4, padding: '10px 12px', minWidth: 180, fontFamily: 'inherit' }}>
                    {isClusterPrimary && (
                      <p style={{ color: '#f59e0b', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>
                        HOTSPOT · {memberCount + 1} REPORTS
                      </p>
                    )}
                    {isClusterMember && (
                      <p style={{ color: '#f59e0b', fontSize: 10, fontFamily: 'monospace', letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>CLUSTER MEMBER</p>
                    )}
                    {issue.imageUrl && (
                      <img src={issue.imageUrl} alt="issue" className="w-full h-24 object-cover my-2 rounded-sm border border-gray-100" />
                    )}
                    <p style={{ color: '#111827', fontSize: 12, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
                      {issue.title}
                      {issue.aiVerified && <span style={{ color: '#198038', marginLeft: 4, fontSize: 10, fontFamily: 'monospace' }}>AI VFD</span>}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 2 }}>{issue.category?.toUpperCase()}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await api.post(`/issues/${issue._id}/vote`, { type: 'up' });
                              // Simple feedback: update UI would need parent refetch, 
                              // for now we just show alert or wait for refresh
                            } catch (err) { console.error(err); }
                          }}
                          className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                        >
                          <ThumbsUp size={12} />
                          <span className="mono text-[10px]">{issue.upvotes?.length || 0}</span>
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await api.post(`/issues/${issue._id}/vote`, { type: 'down' });
                            } catch (err) { console.error(err); }
                          }}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <ThumbsDown size={12} />
                          <span className="mono text-[10px]">{issue.downvotes?.length || 0}</span>
                        </button>
                      </div>
                      {!readOnly && (
                        <button
                          onClick={() => navigate(`/issues/${issue._id}`)}
                          style={{ color: '#0f62fe', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                        >
                          DETAIL →
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
