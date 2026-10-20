import React, { useState } from 'react';
import { Property, AIAnalysisResult } from '../../types';
import { 
  Zap, 
  Droplet, 
  Flame, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Info, 
  ArrowRight,
  Upload,
  Layers
} from 'lucide-react';

interface UtilityRiskAnalyzerProps {
  property: Property;
}

export const UtilityRiskAnalyzer: React.FC<UtilityRiskAnalyzerProps> = ({ property }) => {
  const [excavationDepthM, setExcavationDepthM] = useState<number>(3.5);
  const [excavationZone, setExcavationZone] = useState<string>('Front Setback / Basement Footing');
  const [hasElectricMap, setHasElectricMap] = useState<boolean>(true);
  const [hasWaterSewerMap, setHasWaterSewerMap] = useState<boolean>(true);
  const [hasGasLineData, setHasGasLineData] = useState<boolean>(false);
  const [hasTelecomData, setHasTelecomData] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const missingUtilities: string[] = [];
      if (!hasGasLineData) missingUtilities.push('Natural Gas / PNG distribution mains network plan');
      if (!hasWaterSewerMap) missingUtilities.push('Municipal stormwater and deep gravity trunk sewer schematics');
      if (!hasElectricMap) missingUtilities.push('MSEDCL 11kV high-voltage buried feeder cables alignment');

      const isDataIncomplete = !hasGasLineData;

      const findings = [
        `Proposed Excavation Depth: ${excavationDepthM} meters (${(excavationDepthM * 3.28).toFixed(1)} ft) in ${excavationZone}.`,
        'High-Voltage Electrical Conduit: Identified at 1.2m depth along western roadway verge (Conforms to IS:1255 safety corridor).',
        'Municipal Water Supply Main: 200mm DI line crossing Northern property frontage at 1.8m depth.',
        hasGasLineData
          ? 'Gas pipeline verified outside the foundation load transfer bulb.'
          : 'CRITICAL DATA GAP: Natural Gas (PNG) pipeline presence unconfirmed within 5-meter radius of excavation envelope.'
      ];

      const supportingEvidence = [
        'Pune Municipal Corporation (PMC) water distribution master grid GIS layer',
        'Maharashtra State Electricity Distribution (MSEDCL) sub-station feeder diagrams',
        'Optical fiber network route map (Telecom regulatory survey)'
      ];

      const recommendations = [
        'Mandatory utility marking through municipal One-Call / "Call Before You Dig" locator service 72 hours prior to mechanical trenching.',
        'Conduct non-destructive vacuum excavation or hydro-excavation potholing to visually verify depth of electrical conduits before hydraulic excavator deployment.',
        'Execute multi-frequency Ground Penetrating Radar (GPR) scan (200 MHz - 900 MHz) across entire excavation footprint to resolve gas line ambiguity.'
      ];

      setResult({
        moduleNumber: 52,
        moduleTitle: 'AI Underground Utility Risk Analyzer',
        propertyTitle: property.title,
        summary: isDataIncomplete
          ? 'MODERATE-TO-HIGH RISK: Reliable natural gas pipeline routing data is currently unavailable. Excavation cannot proceed safely without GPR ground-truth verification.'
          : 'LOW-TO-MODERATE RISK: Mapped utilities lie within standard municipal easements. Mechanical digging restricted within 1.5m buffer of western power conduit.',
        findings,
        supportingEvidence,
        confidence: isDataIncomplete ? 'Low' : 'Medium',
        missingInformation: missingUtilities.length > 0 ? missingUtilities : ['None identified'],
        recommendations,
        disclaimer:
          'SAFETY DIRECTIVE: Underground utility indications represent compiled raster records and public agency drawings. AI analysis does NOT substitute for physical electromagnetic line locating, GPR scanning, or mandatory statutory clearance from local utility operators. Unverified excavation carries severe life-safety, fire, and structural hazard.',
        metrics: {
          'Excavation Depth': `${excavationDepthM} m`,
          'Mapped Conflicts': '1 Proximity Alert (Power)',
          'Data Completeness': isDataIncomplete ? '65% (Gas Unmapped)' : '95% (Mapped)',
          'Safety Buffer Required': '1.5 m Manual Digging'
        }
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-blue-900">Feature 52 — Underground Utility Risk Analyzer</h4>
            <p className="text-blue-800 leading-relaxed">
              Detects potential clashes between proposed building excavation, pilings, or basements and underground infrastructure (power cables, gas mains, water networks, telecom fiber) to prevent hazardous strikes.
            </p>
          </div>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Excavation Scope & Depths
          </h5>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Planned Excavation Depth: <strong className="text-slate-900">{excavationDepthM} meters</strong>
            </label>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={excavationDepthM}
              onChange={(e) => setExcavationDepthM(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.5m (Trench)</span>
              <span>3.5m (Basement 1)</span>
              <span>8.0m (Deep Piling)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Excavation Zone</label>
            <select
              value={excavationZone}
              onChange={(e) => setExcavationZone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="Front Setback / Basement Footing">Front Setback / Basement Footing</option>
              <option value="Rear Boundary / Septic Tank Excavation">Rear Boundary / Septic Tank Excavation</option>
              <option value="Side Driveway / Stormwater Trenching">Side Driveway / Stormwater Trenching</option>
              <option value="Full Plot Footprint / Dual Basement Piling">Full Plot Footprint / Dual Basement Piling</option>
            </select>
          </div>
        </div>

        {/* Available Utility Data Sources Check */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Available Supplied Utility Maps
          </h5>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasElectricMap}
                onChange={(e) => setHasElectricMap(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Electrical / HT & LT Distribution Conduit Map
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasWaterSewerMap}
                onChange={(e) => setHasWaterSewerMap(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Droplet className="w-3.5 h-3.5 text-blue-500" /> Municipal Water Main & Drainage Grid
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasGasLineData}
                onChange={(e) => setHasGasLineData(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Piped Natural Gas (PNG) Utility Map
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasTelecomData}
                onChange={(e) => setHasTelecomData(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Telecom / Optical Fiber Conduit Map
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
        >
          {analyzing ? 'Evaluating Subsurface Conflict Layers...' : 'Run Utility Risk Analysis'}
        </button>
      </div>

      {/* Subsurface Stratum & Utility Cross-Section Visualization */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Subsurface Depth Cross-Section & Conflict Zones
        </h5>
        <div className="w-full h-44 bg-slate-900 rounded-lg relative overflow-hidden p-4 text-white text-xs">
          {/* Ground surface line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-emerald-500 flex items-center justify-between px-3 text-[10px] text-emerald-300">
            <span>GROUND LEVEL (0.00 m)</span>
            <span>Natural Grade</span>
          </div>

          {/* Depth indicators */}
          <div className="absolute top-16 left-3 text-[10px] text-slate-400 font-mono">-1.0 m</div>
          <div className="absolute top-24 left-3 text-[10px] text-slate-400 font-mono">-2.0 m</div>
          <div className="absolute top-32 left-3 text-[10px] text-slate-400 font-mono">-3.5 m</div>

          {/* Mapped utility lines */}
          {/* Fiber at 0.8m */}
          <div className="absolute top-14 left-24 right-20 h-1 bg-emerald-400 rounded-full flex items-center justify-end pr-2 text-[9px] text-emerald-200">
            Telecom Fiber (0.8m depth)
          </div>

          {/* Power conduit at 1.2m */}
          <div className="absolute top-18 left-20 right-28 h-2 bg-amber-400 rounded-full flex items-center justify-end pr-2 text-[9px] text-amber-950 font-bold">
            ⚡ 11kV Power Cable (1.2m depth)
          </div>

          {/* Water main at 1.8m */}
          <div className="absolute top-24 left-32 right-12 h-2.5 bg-blue-500 rounded-full flex items-center justify-end pr-2 text-[9px] text-white font-medium">
            Water Main 200mm DI (1.8m depth)
          </div>

          {/* Proposed Excavation Envelope (Red shaded boundary) */}
          <div 
            className="absolute left-40 w-48 border-2 border-dashed border-red-500 bg-red-500/20 top-8 flex items-end justify-center pb-1 text-[10px] text-red-200 font-bold"
            style={{ height: `${Math.min(100, excavationDepthM * 28)}px` }}
          >
            Excavation Zone ({excavationDepthM}m)
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-4 pt-2">
          <div className={`p-4 rounded-xl border ${result.confidence === 'Low' ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 ${result.confidence === 'Low' ? 'text-red-600' : 'text-amber-600'} mt-0.5 shrink-0`} />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Analysis Summary
                  </h4>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${result.confidence === 'Low' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    Confidence: {result.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {result.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200">
                {Object.entries(result.metrics).map(([k, v]) => (
                  <div key={k} className="bg-white/90 p-2 rounded-lg border border-slate-200">
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
                <CheckCircle className="w-4 h-4 text-blue-600" /> Utility Findings
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
                <Info className="w-4 h-4 text-amber-500" /> Critical Data Gaps
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
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-600" /> Mandatory Safety Verification Protocol
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

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Excavation Clearance Disclaimer: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
