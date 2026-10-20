import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { EncroachmentDetector } from './EncroachmentDetector';
import { UtilityRiskAnalyzer } from './UtilityRiskAnalyzer';
import { EarthquakeVulnerability } from './EarthquakeVulnerability';
import { BuyerDemandPredictor } from './BuyerDemandPredictor';
import { InsuranceCostPredictor } from './InsuranceCostPredictor';
import { IllegalFloorDetector } from './IllegalFloorDetector';
import { ViewObstructionPredictor } from './ViewObstructionPredictor';
import { LandDevelopmentAnalyzer } from './LandDevelopmentAnalyzer';
import { 
  Sparkles, 
  Ruler, 
  Zap, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Eye, 
  Layers,
  Home,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const AIPropertyIntelligence: React.FC = () => {
  const { 
    properties, 
    selectedProperty, 
    setSelectedProperty,
    activeAiModule, 
    setActiveAiModule,
    viewPropertyIn3D,
    setActiveTab
  } = useApp();

  const currentProperty = selectedProperty || properties[0];

  const aiModules = [
    {
      id: 51,
      name: 'Boundary Encroachment',
      shortName: '51. Encroachment',
      icon: Ruler,
      description: 'Detects property boundary variances vs recorded deeds'
    },
    {
      id: 52,
      name: 'Underground Utility Risk',
      shortName: '52. Utility Risk',
      icon: Zap,
      description: 'Identifies subsurface pipe & electrical cable conflict zones'
    },
    {
      id: 53,
      name: 'Earthquake Vulnerability',
      shortName: '53. Seismic Risk',
      icon: Activity,
      description: 'Preliminary structural screening under IS 1893 seismic codes'
    },
    {
      id: 54,
      name: 'Resale Buyer Demand',
      shortName: '54. Resale Demand',
      icon: TrendingUp,
      description: 'Forecasts buyer absorption velocity & days on market'
    },
    {
      id: 57,
      name: 'Property Insurance Cost',
      shortName: '57. Insurance Cost',
      icon: ShieldCheck,
      description: 'Estimates structural reconstruction replacement premiums'
    },
    {
      id: 58,
      name: 'Illegal Floor Construction',
      shortName: '58. Floor Compliance',
      icon: Building2,
      description: 'Flags discrepancies between sanctioned municipal plans and storeys'
    },
    {
      id: 59,
      name: 'View Obstruction Predictor',
      shortName: '59. View Obstruction',
      icon: Eye,
      description: 'Simulates 3D horizon sightlines and building blockages'
    },
    {
      id: 60,
      name: 'Land Development Potential',
      shortName: '60. Land Potential',
      icon: Layers,
      description: 'Calculates permissible UDCPR FSI and conceptual massing'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Unified Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Property Intelligence Suite
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
              8 Advanced AI Modules
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Engineered architectural, geospatial, structural, and market valuation tools for verified decision-making.
          </p>
        </div>

        {/* Property Selector Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 shrink-0">Subject Property:</span>
          <select
            value={currentProperty.id}
            onChange={(e) => {
              const p = properties.find((item) => item.id === Number(e.target.value));
              if (p) setSelectedProperty(p);
            }}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 shadow-xs focus:ring-1 focus:ring-blue-500"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.location}) — {formatPrice(p.price)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reusable 6-Step Workflow Guide Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
            <span>Select AI Tool</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">2</span>
            <span>Target Property</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">3</span>
            <span>Attach Evidence</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">4</span>
            <span>Execute Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">5</span>
            <span>Audit Findings</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">6</span>
            <span>Review 3D Spatial</span>
          </div>
        </div>
      </div>

      {/* Module Selector Navigation (Segmented Tabs complying with anti-pill discipline) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {aiModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeAiModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveAiModule(mod.id)}
              className={`flex flex-col items-center text-center p-3 rounded-xl border text-xs transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
              <span className="font-semibold leading-tight line-clamp-1">{mod.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Split Viewport Layout: Active Analysis Engine + Synchronized Property Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Module Container (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          {activeAiModule === 51 && (
            <EncroachmentDetector
              property={currentProperty}
              onView3DPlot={() => setActiveTab('plot-3d')}
            />
          )}
          {activeAiModule === 52 && <UtilityRiskAnalyzer property={currentProperty} />}
          {activeAiModule === 53 && <EarthquakeVulnerability property={currentProperty} />}
          {activeAiModule === 54 && <BuyerDemandPredictor property={currentProperty} />}
          {activeAiModule === 57 && <InsuranceCostPredictor property={currentProperty} />}
          {activeAiModule === 58 && <IllegalFloorDetector property={currentProperty} />}
          {activeAiModule === 59 && <ViewObstructionPredictor property={currentProperty} />}
          {activeAiModule === 60 && (
            <LandDevelopmentAnalyzer
              property={currentProperty}
              onOpenPlot3D={() => setActiveTab('plot-3d')}
            />
          )}
        </div>

        {/* Right Column: Synchronized Property Reference Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Associated Property
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentProperty.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{currentProperty.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentProperty.location}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Asking Price:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatPrice(currentProperty.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Config:</span>
                <span className="font-semibold text-slate-800">
                  {currentProperty.type} · {currentProperty.bedrooms} Beds / {currentProperty.bathrooms} Baths
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Super Area:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{currentProperty.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Year Built:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {currentProperty.yearBuilt || 2021}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seller / Broker:</span>
                <span className="font-semibold text-slate-800">{currentProperty.seller}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentProperty.description}
            </p>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => viewPropertyIn3D(currentProperty)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Launch 3D Property Model</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('plot-3d')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>Inspect Cadastral Plot & Setbacks</span>
                <Layers className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* AI Accuracy Assurance Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
            <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ground-Truth Protocol
            </h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              EstateHub AI models enforce strict zero-hallucination policies. Assessments separate verified document datum from machine-vision estimates, and will decline predictions if mandatory structural or cadastral layers are absent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
