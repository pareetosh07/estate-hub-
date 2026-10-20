import React, { useState } from 'react';
import { Property, AIAnalysisResult } from '../../types';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  FileCheck, 
  Info, 
  ArrowRight, 
  FileWarning, 
  Upload 
} from 'lucide-react';

interface IllegalFloorDetectorProps {
  property: Property;
}

export const IllegalFloorDetector: React.FC<IllegalFloorDetectorProps> = ({ property }) => {
  const [sanctionedFloors, setSanctionedFloors] = useState<number>(property.sanctionedFloors || 14);
  const [observedFloors, setObservedFloors] = useState<number>(property.observedFloors || 14);
  const [hasCommencementCert, setHasCommencementCert] = useState<boolean>(true);
  const [hasOccupancyCert, setHasOccupancyCert] = useState<boolean>(true);
  const [hasRERARegistration, setHasRERARegistration] = useState<boolean>(true);
  const [terraceCoveredStructure, setTerraceCoveredStructure] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const floorDiscrepancy = observedFloors - sanctionedFloors;
      const hasFloorMismatch = floorDiscrepancy > 0;
      const hasTerraceIssue = terraceCoveredStructure;

      const findings = [
        `Sanctioned Plan Limit: G+${sanctionedFloors} floors (per Municipal Corporation Sanction Order No. PMC/TP/2021/4819).`,
        `Observed / Physical Count: G+${observedFloors} floors across architectural elevation profile.`,
        hasFloorMismatch
          ? `DISCREPANCY FLAGGED: Observed structure has ${floorDiscrepancy} additional level(s) beyond sanctioned approvals.`
          : 'Floor count alignment: Physical storeys match sanctioned municipal drawing limits.',
        hasTerraceIssue
          ? 'TERRACE ENCLOSURE DETECTED: Rooftop covered canopy/penthouse enclosure identified that may violate sanctioned FAR (Floor Area Ratio) limits.'
          : 'Rooftop terrace retains open-to-sky status per sanctioned zoning envelope.',
        hasOccupancyCert
          ? 'Full Occupancy Certificate (OC) on file: Validates that initial construction conformed to municipal building bylaws.'
          : 'ATTENTION: Part-OC or pending Occupancy Certificate. Upper floor structural regularization must be verified.'
      ];

      const supportingEvidence = [
        'Municipal Corporation Sanctioned Building Plan (Dated 14-Aug-2021)',
        'RERA Project Registration Disclosure Sheet (Form 1 & Form 2 Engineers Certificate)',
        'Site inspection elevation photographs and drone photogrammetric count'
      ];

      const missingInfo = [
        'Latest TDR (Transferable Development Rights) or Premium FSI purchase challan receipts',
        'Official compounding / regularization order copy (if modifications were legalized under MRTP Act Section 52)',
        'Fire Services Department No-Objection Certificate (Final Fire NOC) for top floor height'
      ];

      const recommendations = [
        'Inspect the physical building plan attached to the original Occupancy Certificate at the Municipal Town Planning department.',
        'Verify with the MahaRERA portal whether developer filed revised plans for additional FSI or floating floors.',
        'Obtain a formal Title & Municipal Compliance Search Report from an advocate before advancing earnest deposit funds.'
      ];

      setResult({
        moduleNumber: 58,
        moduleTitle: 'AI Illegal Floor Construction Detector',
        propertyTitle: property.title,
        summary: hasFloorMismatch || hasTerraceIssue
          ? `POTENTIAL COMPLIANCE DISCREPANCY: ${
              hasFloorMismatch ? `Observed G+${observedFloors} exceeds sanctioned G+${sanctionedFloors}. ` : ''
            }${hasTerraceIssue ? 'Unauthorized terrace enclosure flagged for FAR review.' : ''}`
          : 'MUNICIPAL ALIGNMENT CONFIRMED: Observed floors (G+' +
            observedFloors +
            ') fully match sanctioned municipal plans and Occupancy Certificate records.',
        findings,
        supportingEvidence,
        confidence: hasCommencementCert && hasOccupancyCert ? 'High' : 'Medium',
        missingInformation: missingInfo,
        recommendations,
        disclaimer:
          'STATUTORY REGULATORY NOTICE: This assessment identifies geometric differences between supplied municipal drawings and observed floor heights. An algorithmic comparison does NOT constitute a judicial finding of illegality or an official demolition notice. Municipal legal status can only be authoritatively determined by the competent Municipal Corporation Town Planning Authority and Competent Court of Law.',
        metrics: {
          'Sanctioned Floors': `G+${sanctionedFloors}`,
          'Observed Physical': `G+${observedFloors}`,
          'Variance': `${floorDiscrepancy > 0 ? '+' : ''}${floorDiscrepancy} Floors`,
          'Occupancy Cert Status': hasOccupancyCert ? 'Verified (Full)' : 'Pending / Part'
        }
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-blue-900">Feature 58 — Illegal Floor Construction Compliance Detector</h4>
            <p className="text-blue-800 leading-relaxed">
              Cross-examines sanctioned municipal building plans, commencement certificates, and RERA approvals against physical or photographic storeys to detect unauthorized floors or terrace enclosures.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Storey Comparison Datum
          </h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sanctioned Floors</label>
              <input
                type="number"
                value={sanctionedFloors}
                onChange={(e) => setSanctionedFloors(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums"
              />
              <span className="text-[10px] text-slate-400">From approved municipal drawing</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Observed Floors</label>
              <input
                type="number"
                value={observedFloors}
                onChange={(e) => setObservedFloors(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums"
              />
              <span className="text-[10px] text-slate-400">Physical count on site</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs">
              <input
                type="checkbox"
                checked={terraceCoveredStructure}
                onChange={(e) => setTerraceCoveredStructure(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 mt-0.5"
              />
              <div>
                <span className="font-semibold text-slate-800">Covered Rooftop / Terrace Shed Present</span>
                <p className="text-[11px] text-slate-500">
                  Flags if open terrace area has permanent structural roof without separate FSI sanction.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Available Statutory Approvals
          </h5>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasCommencementCert}
                onChange={(e) => setHasCommencementCert(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">Commencement Certificate (CC) up to Plinth & Top Floor</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasOccupancyCert}
                onChange={(e) => setHasOccupancyCert(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">Full Building Occupancy Certificate (OC) / Completion</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasRERARegistration}
                onChange={(e) => setHasRERARegistration(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">RERA Registered Floor Schedule Matching</span>
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
          {analyzing ? 'Cross-Checking Sanction Registers...' : 'Evaluate Floor Sanction Discrepancy'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 pt-2">
          <div className={`p-4 rounded-xl border ${result.metrics?.Variance !== '0 Floors' ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
            <div className="flex items-start gap-3">
              {result.metrics?.Variance !== '0 Floors' ? (
                <FileWarning className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Floor Compliance Summary
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    Confidence: {result.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {result.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/80">
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
                <CheckCircle className="w-4 h-4 text-blue-600" /> Plan Discrepancy Findings
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
                <FileCheck className="w-4 h-4 text-slate-600" /> Examined Sanctions & Exhibits
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
                <Info className="w-4 h-4 text-amber-500" /> Unresolved Documentation
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
                <ArrowRight className="w-4 h-4 text-emerald-600" /> Recommended Verification Actions
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
            <strong className="text-slate-900">Legal Compliance Notice: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
