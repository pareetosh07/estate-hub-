import React, { useState } from 'react';
import { formatPrice } from '../../data/initialData';
import { 
  Sparkles, 
  Home, 
  Bed, 
  Bath, 
  MapPin, 
  Car, 
  Info, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

export const PricePredictionTool: React.FC = () => {
  const [area, setArea] = useState<number>(1000);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [locationCategory, setLocationCategory] = useState<'Standard' | 'Premium' | 'Luxury'>('Premium');
  const [propertyType, setPropertyType] = useState<'Apartment' | 'Villa' | 'Independent House' | 'Plot'>('Apartment');
  const [parking, setParking] = useState<number>(1);
  const [hasPredicted, setHasPredicted] = useState<boolean>(false);

  // Exact valuation logic preserved from Admindash_808fcda0.py and Userdashboard_2cb20653.py:
  let pricePerSqFt = 6000;
  if (locationCategory === 'Premium') pricePerSqFt = 8500;
  else if (locationCategory === 'Luxury') pricePerSqFt = 12000;

  let typeAdjustment = 0;
  if (propertyType === 'Villa') typeAdjustment = 1500000;
  else if (propertyType === 'Independent House') typeAdjustment = 1000000;
  else if (propertyType === 'Plot') typeAdjustment = -500000;

  const bedroomAdjustment = bedrooms * 200000;
  const bathroomAdjustment = bathrooms * 100000;
  const parkingAdjustment = parking * 150000;

  const estimatedPrice =
    area * pricePerSqFt +
    bedroomAdjustment +
    bathroomAdjustment +
    parkingAdjustment +
    typeAdjustment;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Property Price Valuation Engine
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
              Rule-Based Baseline & ML Pipeline
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Estimate market valuations based on square footage, location tier, room counts, and typology adjustments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            Enter Property Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Area: <strong className="text-slate-900 tabular-nums">{area} sq.ft</strong>
              </label>
              <input
                type="number"
                min="300"
                max="10000"
                step="50"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location Category</label>
              <select
                value={locationCategory}
                onChange={(e) => setLocationCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Standard">Standard (₹6,000 / sq.ft)</option>
                <option value="Premium">Premium (₹8,500 / sq.ft)</option>
                <option value="Luxury">Luxury (₹12,000 / sq.ft)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Property Typology</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa (+₹15L)</option>
                <option value="Independent House">Independent House (+₹10L)</option>
                <option value="Plot">Plotted Land (-₹5L)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Parking Spaces</label>
              <input
                type="number"
                min="0"
                max="5"
                value={parking}
                onChange={(e) => setParking(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => setHasPredicted(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Calculate Estimated Property Price
          </button>
        </div>

        {/* Valuation Result Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Valuation
            </span>

            <div>
              <div className="text-3xl font-extrabold text-blue-600 tabular-nums">
                {formatPrice(estimatedPrice)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Derived for {area} sq.ft {propertyType} in {locationCategory} Zone
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-xs pt-2">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Base Price (Area × Rate):</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatPrice(area * pricePerSqFt)}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Bedrooms Adjustment:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  +{formatPrice(bedroomAdjustment)}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Bathrooms Adjustment:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  +{formatPrice(bathroomAdjustment)}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Parking Adjustment:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  +{formatPrice(parkingAdjustment)}
                </span>
              </div>
              {typeAdjustment !== 0 && (
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Typology Adjustment:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {typeAdjustment > 0 ? '+' : ''}{formatPrice(typeAdjustment)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <div className="font-semibold text-blue-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" /> Transparent Mathematical Model
            </div>
            <p className="text-[11px] text-blue-800">
              This transparent formula preserves the baseline algorithm from EstateHub Python backend. In production deployment, connect your trained Scikit-learn or XGBoost regression model via the server-side API endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
