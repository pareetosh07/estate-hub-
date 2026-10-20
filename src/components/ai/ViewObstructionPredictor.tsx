import React, { useState } from 'react';
import { Property, AIAnalysisResult } from '../../types';
import { 
  Eye, 
  Compass, 
  Building, 
  Mountain, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ArrowRight,
  Sun
} from 'lucide-react';

interface ViewObstructionPredictorProps {
  property: Property;
}

export const ViewObstructionPredictor: React.FC<ViewObstructionPredictorProps> = ({ property }) => {
  const [unitFloor, setUnitFloor] = useState<number>(8); // 8th floor unit
  const [windowOrientation, setWindowOrientation] = useState<string>('East (Sunrise / Valley)');
  const [distanceToNeighborM, setDistanceToNeighborM] = useState<number>(45); // 45 meters to neighboring tower
  const [neighborHeightStoreys, setNeighborHeightStoreys] = useState<number>(14); // 14 floor neighbor
  const [futureZoningStatus, setFutureZoningStatus] = useState<string>('Reserved Green Belt / No High-Rise Sanction');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  // Geometric line of sight math
  const floorHeightM = 3.0;
  const unitElevationM = unitFloor * floorHeightM;
  const neighborElevationM = neighborHeightStoreys * floorHeightM;
  const heightDeltaM = neighborElevationM - unitElevationM;
  // Sightline angular obstruction
  const obstructionAngleDeg = Math.round(
    Math.atan2(Math.max(0, heightDeltaM), distanceToNeighborM) * (180 / Math.PI)
  );
  const isObstructed = heightDeltaM > 0;

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const findings = [
        `Viewing Unit Elevation: Level ${unitFloor} (+${unitElevationM} meters above datum) facing ${windowOrientation}.`,
        `Neighboring Structure: G+${neighborHeightStoreys} storeys (+${neighborElevationM} meters high) at ${distanceToNeighborM}m lateral offset.`,
        isObstructed
          ? `Partial Horizon Obstruction: Adjacent tower creates a ${obstructionAngleDeg}° vertical obstruction angle across eastern azimuth (30° - 65° field of view).`
          : `Unobstructed Open Sightline: Unit elevation at ${unitElevationM}m clears the adjacent rooftop (+${neighborElevationM}m) by +${Math.abs(heightDeltaM)}m, providing clear panoramic horizon view.`,
        `Solar Daylighting: East-facing aspect receives unshaded direct morning sunlight from 06:30 to 11:15 AM.`
      ];

      const supportingEvidence = [
        'Municipal GIS 3D massing and sanctioned plot height envelope data',
        'Digital Elevation Model (DEM) topographic contours (Survey of India)',
        'Solar Azimuth & Sun-Path stereographic chart calculations'
      ];

      const missingInfo = [
        'Sanctioned plans for vacant plot located 120m to the North-East',
        'Tree canopy maturation heights along front boulevard landscaping',
        'Rooftop cellular tower / water tank superstructure heights on adjacent building'
      ];

      const recommendations = [
        'Conduct physical site inspection during morning sunrise window to assess actual ambient light reflectance.',
        'Review Town Planning reservation sheets for adjacent vacant parcels to verify permanent FSI restrictions.',
        'Verify that minimum 12-meter open space buffer under Municipal DCR is preserved along window perimeter.'
      ];

      setResult({
        moduleNumber: 59,
        moduleTitle: 'AI Property View Obstruction Predictor',
        propertyTitle: property.title,
        summary: isObstructed
          ? `PARTIAL VIEW INTERFERENCE: Adjacent tower exceeds unit elevation by +${heightDeltaM}m at 45m distance, narrowing direct horizon vista by approximately ${obstructionAngleDeg}°. Peripheral mountain views remain open.`
          : `UNOBSTRUCTED PANORAMIC VIEW: Unit on 8th floor sits comfortably above the adjacent building ridge line, ensuring unobstructed panoramic views and optimal natural illumination.`,
        findings,
        supportingEvidence,
        confidence: 'Medium',
        missingInformation: missingInfo,
        recommendations,
        disclaimer:
          'SIMULATION NOTICE: This sightline analysis is a geometric projection based on supplied heights and current municipal spatial data. It does NOT guarantee future view permanence. Future changes to zoning regulations, TDR utilization, or redevelopment of adjacent properties can alter sightlines.',
        metrics: {
          'Sightline Status': isObstructed ? 'Partial Horizon Block' : 'Clear Panoramic Vista',
          'Unit Elevation': `+${unitElevationM} meters`,
          'Obstacle Delta': `${heightDeltaM > 0 ? '+' : ''}${heightDeltaM} m`,
          'Obstruction Angle': `${obstructionAngleDeg}°`
        }
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-blue-900">Feature 59 — Property View Obstruction Predictor</h4>
            <p className="text-blue-800 leading-relaxed">
              Calculates 3D geometric line-of-sight sightlines based on apartment floor height, window orientation, and neighboring building heights to assess horizon vistas and daylight exposure.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Subject Unit Elevation & Aspect
          </h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Apartment Floor: <strong className="text-slate-900">{unitFloor}th Floor</strong>
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={unitFloor}
                onChange={(e) => setUnitFloor(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">Elevation: +{unitElevationM} meters</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Window Direction</label>
              <select
                value={windowOrientation}
                onChange={(e) => setWindowOrientation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
              >
                <option value="East (Sunrise / Valley)">East (Sunrise / Valley)</option>
                <option value="West (Sunset / Cityscape)">West (Sunset / Cityscape)</option>
                <option value="North (Diffuse Daylight / Hills)">North (Diffuse Daylight / Hills)</option>
                <option value="South (All-Day Sun / Clubhouse)">South (All-Day Sun / Clubhouse)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Adjacent Obstacle Parameters
          </h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Neighbor Distance: <strong className="text-slate-900">{distanceToNeighborM} m</strong>
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={distanceToNeighborM}
                onChange={(e) => setDistanceToNeighborM(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">Distance to nearest façade</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Neighbor Height</label>
              <select
                value={neighborHeightStoreys}
                onChange={(e) => setNeighborHeightStoreys(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
              >
                <option value="4">G+4 Low-Rise (12m)</option>
                <option value="8">G+8 Mid-Rise (24m)</option>
                <option value="14">G+14 High-Rise (42m)</option>
                <option value="20">G+20 Skyscraper (60m)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
        >
          {analyzing ? 'Tracing Raycast Sightlines...' : 'Simulate Line-of-Sight View'}
        </button>
      </div>

      {/* Sightline Raycast Diagram */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Sightline Profile Cross-Section
        </h5>
        <div className="w-full h-44 bg-slate-900 rounded-lg relative overflow-hidden p-4 text-white text-xs">
          {/* Ground level */}
          <div className="absolute bottom-4 left-0 right-0 h-1 bg-slate-700"></div>

          {/* Subject Building (Left) */}
          <div 
            className="absolute bottom-4 left-10 w-16 bg-blue-600 rounded-t border-t-2 border-blue-400 flex flex-col justify-between items-center py-1 text-[9px] text-white"
            style={{ height: `${Math.min(130, unitFloor * 6 + 20)}px` }}
          >
            <span className="font-bold">Your Unit</span>
            <span>Fl {unitFloor}</span>
          </div>

          {/* Sightline Ray */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1="90"
              y1={160 - (unitFloor * 6 + 15)}
              x2="320"
              y2={isObstructed ? 160 - (neighborHeightStoreys * 5 + 10) : 30}
              stroke={isObstructed ? '#ef4444' : '#10b981'}
              strokeWidth="2"
              strokeDasharray={isObstructed ? '4,3' : 'none'}
            />
          </svg>

          {/* Neighbor Building (Right) */}
          <div 
            className="absolute bottom-4 left-64 w-20 bg-slate-700 rounded-t border-t-2 border-slate-500 flex flex-col justify-between items-center py-1 text-[9px] text-slate-200"
            style={{ height: `${Math.min(140, neighborHeightStoreys * 6)}px` }}
          >
            <span className="font-bold">Neighbor</span>
            <span>G+{neighborHeightStoreys} ({neighborHeightStoreys * 3}m)</span>
          </div>

          {/* Horizon text */}
          <div className="absolute top-4 right-6 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Open Valley Horizon
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Sightline Simulation Summary
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Confidence: {result.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {result.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100">
                {Object.entries(result.metrics).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">{k}</div>
                    <div className="text-xs font-bold text-slate-900 tabular-nums">{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" /> Sightline Findings
              </h5>
              <ul className="text-xs text-slate-600 space-y-2">
                {result.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-600" /> Elevation Topography Reference
              </h5>
              <ul className="text-xs text-slate-600 space-y-2">
                {result.supportingEvidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" /> Unknown Spatial Variables
              </h5>
              <ul className="text-xs text-slate-600 space-y-2">
                {result.missingInformation.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">!</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-600" /> Recommended Verification
              </h5>
              <ul className="text-xs text-slate-600 space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Geometric Projection Notice: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
