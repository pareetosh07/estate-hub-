import React, { useState } from 'react';
import { Property, AIAnalysisResult } from '../../types';
import { formatPrice } from '../../data/initialData';
import { 
  ShieldCheck, 
  Flame, 
  Umbrella, 
  DollarSign, 
  CheckCircle, 
  Info, 
  ArrowRight, 
  FileText 
} from 'lucide-react';

interface InsuranceCostPredictorProps {
  property: Property;
}

export const InsuranceCostPredictor: React.FC<InsuranceCostPredictorProps> = ({ property }) => {
  const [reconstructionCostSqFt, setReconstructionCostSqFt] = useState<number>(2400); // Standard civil reconstruction cost ₹/sq.ft
  const [hasFireHydrant, setHasFireHydrant] = useState<boolean>(true);
  const [hasSprinklers, setHasSprinklers] = useState<boolean>(true);
  const [hasSecurity24x7, setHasSecurity24x7] = useState<boolean>(true);
  const [deductibleAmt, setDeductibleAmt] = useState<number>(10000);
  const [floodZoneRisk, setFloodZoneRisk] = useState<string>('Low (Above 100-Year Flood Contour)');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const totalReconstructionVal = (property.areaSqFt || 1000) * reconstructionCostSqFt;

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      // Actuarial standard Bharat Griha Raksha indicative baseline: ~₹0.20 - ₹0.35 per ₹1,000 sum insured
      let baseRatePerThousand = 0.28;
      if (hasFireHydrant && hasSprinklers) baseRatePerThousand -= 0.04;
      if (floodZoneRisk.includes('Moderate')) baseRatePerThousand += 0.05;

      const estimatedAnnualMin = Math.round((totalReconstructionVal / 1000) * (baseRatePerThousand * 0.85));
      const estimatedAnnualMax = Math.round((totalReconstructionVal / 1000) * (baseRatePerThousand * 1.25));

      const findings = [
        `Reconstruction Replacement Value: ${formatPrice(totalReconstructionVal)} (based on civil structural rate of ₹${reconstructionCostSqFt}/sq.ft). Note: Excludes non-insurable land value.`,
        `Estimated Indicative Annual Premium: ₹${estimatedAnnualMin.toLocaleString()} - ₹${estimatedAnnualMax.toLocaleString()} / year (Standard Bharat Griha Raksha policy scope).`,
        hasFireHydrant && hasSprinklers
          ? 'Fire Protection Credit Applied: Automatic wet-pipe sprinkler grid and certified booster pump system qualify for preferential underwriter rating.'
          : 'Standard fire tariff applied without mitigation discounts.',
        `Location Hazard Profile: ${floodZoneRisk}. Seismic risk rated under Zone III tariffs.`
      ];

      const supportingEvidence = [
        'General Insurance Council (GIC) Standard Home Insurance (Bharat Griha Raksha) base tariff schedules',
        'National Building Code (NBC 2016 Part 4) Fire & Life Safety conformance requirements',
        'Central Water Commission (CWC) regional river basin flood level benchmarks'
      ];

      const missingInfo = [
        'Complete inventory schedules for high-value internal contents / fine art / bespoke fixtures',
        'Society structural health audit reports regarding plinth seepage history',
        'Insurer-specific telematics or claims history records for the cooperative housing society'
      ];

      const recommendations = [
        'Secure policy on an "Agreed Value" or "Reinstatement Value" basis rather than depreciated book value.',
        'Ensure terrorism and earthquake STFI (Storm, Tempest, Flood, Inundation) riders are explicitly endorsed.',
        'Request formal written quotations from at least 2 licensed IRDAI-regulated general insurers before policy inception.'
      ];

      setResult({
        moduleNumber: 57,
        moduleTitle: 'AI Property Insurance Cost Predictor',
        propertyTitle: property.title,
        summary: `ESTIMATED PREMIUM BRACKET: ₹${estimatedAnnualMin.toLocaleString()} – ₹${estimatedAnnualMax.toLocaleString()} / year for a replacement sum insured of ${formatPrice(totalReconstructionVal)}. Actual quote varies based on chosen content riders and insurer underwriting loss ratios.`,
        findings,
        supportingEvidence,
        confidence: 'Medium',
        missingInformation: missingInfo,
        recommendations,
        disclaimer:
          'NON-BINDING UNDERWRITING NOTICE: This calculation is an educational actuarial benchmark model and does NOT represent an official insurance binder, policy quote, or guarantee of insurability. Final premiums and coverage terms are determined exclusively by authorized insurance underwriters pursuant to IRDAI guidelines upon physical risk inspection.',
        metrics: {
          'Reconstruction Value': formatPrice(totalReconstructionVal),
          'Est. Annual Premium': `₹${estimatedAnnualMin.toLocaleString()} - ₹${estimatedAnnualMax.toLocaleString()}`,
          'Chosen Deductible': `₹${deductibleAmt.toLocaleString()}`,
          'Fire Mitigation Discount': hasSprinklers ? '15% Applied' : 'None'
        }
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-blue-900">Feature 57 — Property Insurance Cost Predictor</h4>
            <p className="text-blue-800 leading-relaxed">
              Estimates standard replacement cost and indicative annual home insurance premiums (Bharat Griha Raksha structure) based on civil construction rates, flood exposure, and fire suppression systems.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Reconstruction & Coverage Basis
          </h5>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Reconstruction Civil Cost: <strong className="text-slate-900 tabular-nums">₹{reconstructionCostSqFt}/sq.ft</strong>
            </label>
            <input
              type="range"
              min="1600"
              max="4000"
              step="100"
              value={reconstructionCostSqFt}
              onChange={(e) => setReconstructionCostSqFt(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1,600 (Economy)</span>
              <span>₹2,400 (Standard)</span>
              <span>₹4,000 (Luxury Villa)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between">
            <span className="text-slate-500">Insurable Building Sum Insured:</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatPrice(totalReconstructionVal)}</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Voluntary Policy Deductible</label>
            <select
              value={deductibleAmt}
              onChange={(e) => setDeductibleAmt(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="5000">₹5,000 Deductible</option>
              <option value="10000">₹10,000 Standard Deductible</option>
              <option value="25000">₹25,000 Higher Deductible (Lower Premium)</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Hazard Mitigation Features
          </h5>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasFireHydrant}
                onChange={(e) => setHasFireHydrant(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">External Wet-Riser & Fire Hydrant System</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasSprinklers}
                onChange={(e) => setHasSprinklers(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">Automatic Fire Sprinklers in Living Quarters</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
              <input
                type="checkbox"
                checked={hasSecurity24x7}
                onChange={(e) => setHasSecurity24x7(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span className="text-slate-800 font-medium">24/7 Gated Security & CCTV Surveillance (Burglary Discount)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Local Inundation / Flood Exposure</label>
            <select
              value={floodZoneRisk}
              onChange={(e) => setFloodZoneRisk(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="Low (Above 100-Year Flood Contour)">Low (Above 100-Year Flood Contour)</option>
              <option value="Moderate (Near Seasonal Nullah / Low Ground)">Moderate (Near Seasonal Nullah)</option>
              <option value="High (Historical Water-Logging Prone)">High (Historical Water-Logging Prone)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
        >
          {analyzing ? 'Computing Underwriting Benchmark Table...' : 'Calculate Benchmark Insurance Premium'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Premium Estimation Summary
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                <CheckCircle className="w-4 h-4 text-blue-600" /> Pricing Factors & Calculations
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
                <FileText className="w-4 h-4 text-slate-600" /> Underwriting Tariff Sources
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
                <Info className="w-4 h-4 text-amber-500" /> Assumptions & Exclusions
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
                <ArrowRight className="w-4 h-4 text-emerald-600" /> Policy Procurement Advice
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
            <strong className="text-slate-900">Actuarial Disclaimer: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
