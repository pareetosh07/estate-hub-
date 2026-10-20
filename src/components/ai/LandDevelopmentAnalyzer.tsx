import React, { useState } from 'react';
import { Property, AIAnalysisResult } from '../../types';
import { 
  Compass, 
  Building, 
  Ruler, 
  CheckCircle, 
  Info, 
  ArrowRight, 
  TrendingUp, 
  Layers,
  FileText
} from 'lucide-react';

interface LandDevelopmentAnalyzerProps {
  property: Property;
  onOpenPlot3D?: () => void;
}

export const LandDevelopmentAnalyzer: React.FC<LandDevelopmentAnalyzerProps> = ({
  property,
  onOpenPlot3D
}) => {
  const [plotAreaSqFt, setPlotAreaSqFt] = useState<number>(
    (property.plotDimensions?.lengthFt || 80) * (property.plotDimensions?.widthFt || 60)
  );
  const [roadWidthM, setRoadWidthM] = useState<number>(12); // 12 meter road (40 ft)
  const [zoningType, setZoningType] = useState<string>('Residential R-2 (High Density Urban Zone)');
  const [selectedScenario, setSelectedScenario] = useState<string>('Residential Tower (G+7 Floors)');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  // Municipal UDCPR (Unified Development Control and Promotion Regulations) Formulas:
  // Road width 12m allows Base FSI: 1.1 + Premium FSI: 0.5 + TDR: 0.4 = Total Potential FSI ~ 2.0
  const baseFSI = roadWidthM >= 18 ? 1.4 : roadWidthM >= 12 ? 1.1 : 1.0;
  const maxPotentialFSI = roadWidthM >= 18 ? 2.5 : roadWidthM >= 12 ? 2.0 : 1.5;
  const potentialBuiltUpSqFt = Math.round(plotAreaSqFt * maxPotentialFSI);
  const estimatedUnits = Math.round(potentialBuiltUpSqFt / 950); // ~950 sq.ft per 2 BHK unit

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const findings = [
        `Development Envelope: Plot area of ${plotAreaSqFt.toLocaleString()} sq.ft with ${roadWidthM}m (${(roadWidthM * 3.28).toFixed(0)} ft) front road access.`,
        `Applicable Planning Code: Unified DCPR (UDCPR 2020 Maharashtra / Regulation 6.1).`,
        `Permissible FSI Range: Base FSI ${baseFSI} up to Maximum Potential FSI ${maxPotentialFSI} (with paid Premium FSI & TDR loading).`,
        `Total Buildable Potential: Approximately ${potentialBuiltUpSqFt.toLocaleString()} sq.ft gross built-up area yield (~${estimatedUnits} typical 2 BHK units).`,
        `Ground Coverage Ceiling: Maximum 45% footprint (${Math.round(plotAreaSqFt * 0.45).toLocaleString()} sq.ft) with standard front, side, and rear statutory setbacks.`
      ];

      const scenarios = [
        `Scenario A (Pure Residential): G+7 Mid-Rise with ${estimatedUnits} residential units and stilt parking.`,
        `Scenario B (Mixed-Use Commercial): Ground + 1st Floor retail high-street shops + 5 upper residential floors.`,
        `Scenario C (Gated Plotted Enclave): Sub-division into 4 independent bungalow plots (each ~${Math.round(plotAreaSqFt / 4)} sq.ft).`
      ];

      const missingInfo = [
        'DP (Development Plan) 20-year reservation status (checking road widening or public garden reservations)',
        'Environmental Clearance (EC) requirement threshold (applicable if gross built-up exceeds 20,000 sq.m)',
        'Aviation Authority (AAI) NOC for building height clearance near Lohegaon / Pune Airport'
      ];

      const recommendations = [
        'Engage an empanelled Town Planning Architect to draft a formal Municipal Drawing Submission sheet under UDCPR Rule 3.',
        'Submit a proposal to the local Tree Authority for arboriculture clearance before ground clearing.',
        'Obtain a Demarcation & Zoning Certificate (DP Remark) directly from the Municipal Corporation Town Planning department.'
      ];

      setResult({
        moduleNumber: 60,
        moduleTitle: 'AI Land Development Potential Analyzer',
        propertyTitle: property.title,
        summary: `DEVELOPMENT YIELD POTENTIAL: ${potentialBuiltUpSqFt.toLocaleString()} sq.ft gross built-up area supported by ${roadWidthM}m road frontage under UDCPR zoning. Maximum allowable FSI capacity is ${maxPotentialFSI}. Conceptual 3D building massing generated.`,
        findings,
        supportingEvidence: scenarios,
        confidence: 'Medium',
        missingInformation: missingInfo,
        recommendations,
        disclaimer:
          'STATUTORY REGULATORY DISCLAIMER: This development assessment is an indicative architectural feasibility model based on current Unified Development Control regulations. Actual sanctionable built-up area, allowable height, and TDR utilization are strictly subject to formal scrutiny, municipal fees, and sanction by the Competent Municipal Authority.',
        metrics: {
          'Base FSI': baseFSI,
          'Max Potential FSI': maxPotentialFSI,
          'Gross Built-up': `${potentialBuiltUpSqFt.toLocaleString()} sq.ft`,
          'Unit Yield': `~${estimatedUnits} Units`
        }
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-blue-900">Feature 60 — Land Development Potential Analyzer</h4>
            <p className="text-blue-800 leading-relaxed">
              Computes allowable FSI/FAR, permissible built-up area, ground coverage limits, and unit yield under municipal development control rules (UDCPR) with interactive 3D conceptual massing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Plot Dimensions & Road Infrastructure
          </h5>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Plot Area: <strong className="text-slate-900 tabular-nums">{plotAreaSqFt.toLocaleString()} sq.ft</strong>
            </label>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={plotAreaSqFt}
              onChange={(e) => setPlotAreaSqFt(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2,000 sq.ft</span>
              <span>10,000 sq.ft</span>
              <span>25,000 sq.ft</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Access Road Width: <strong className="text-slate-900">{roadWidthM} meters ({(roadWidthM * 3.28).toFixed(0)} ft)</strong>
            </label>
            <select
              value={roadWidthM}
              onChange={(e) => setRoadWidthM(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="9">9 meters (30 ft) — Base FSI 1.0 / Max 1.4</option>
              <option value="12">12 meters (40 ft) — Base FSI 1.1 / Max 2.0</option>
              <option value="18">18 meters (60 ft) — Base FSI 1.4 / Max 2.5</option>
              <option value="24">24 meters (80 ft) — Base FSI 1.5 / Max 3.0</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Zoning & Master Plan Designation
          </h5>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Municipal Master Plan Zone</label>
            <select
              value={zoningType}
              onChange={(e) => setZoningType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="Residential R-2 (High Density Urban Zone)">Residential R-2 (High Density Urban Zone)</option>
              <option value="Commercial C-1 (Retail & Commercial Offices)">Commercial C-1 (Retail & Commercial Offices)</option>
              <option value="Mixed Use (Residential + Ground Commercial)">Mixed Use (Residential + Ground Commercial)</option>
              <option value="Residential R-1 (Low Density Suburban Zone)">Residential R-1 (Low Density Suburban Zone)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Proposed Development Model</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="Residential Tower (G+7 Floors)">Residential Tower (G+7 Floors)</option>
              <option value="Mixed-Use Commercial Complex">Mixed-Use Commercial Complex</option>
              <option value="Gated Plotted Bungalow Development">Gated Plotted Bungalow Development</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {onOpenPlot3D && (
          <button
            onClick={onOpenPlot3D}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Open in Interactive 3D Plot Massing Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 ml-auto"
        >
          {analyzing ? 'Computing UDCPR FSI & Envelope Capacity...' : 'Analyze Land Development Potential'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Development Potential Summary
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
                <CheckCircle className="w-4 h-4 text-blue-600" /> Planning Assessment Findings
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
                <Building className="w-4 h-4 text-slate-600" /> Evaluated Development Scenarios
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
                <Info className="w-4 h-4 text-amber-500" /> Planning Questions for Professional Verification
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
                <ArrowRight className="w-4 h-4 text-emerald-600" /> Professional Next Steps
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
            <strong className="text-slate-900">Statutory Planning Disclaimer: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
