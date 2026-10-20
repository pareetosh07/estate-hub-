import React, { useState } from 'react';
import { Property } from '../../types';
import { formatPrice } from '../../data/initialData';
import { Calendar, Clock, MapPin, X, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  property: Property;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: {
    property: string;
    propertyId: number;
    location: string;
    date: string;
    type: 'Property Visit' | 'Online Meeting';
    message: string;
    user: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  userName,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [visitType, setVisitType] = useState<'Property Visit' | 'Online Meeting'>('Property Visit');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      property: property.title,
      propertyId: property.id,
      location: property.location,
      date: visitDate,
      type: visitType,
      message,
      user: userName
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Schedule Property Inspection</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Booking Confirmed!</h4>
            <p className="text-xs text-slate-500">
              Your visit request for <strong>{property.title}</strong> on <strong>{visitDate}</strong> has been logged into your bookings schedule.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Property summary pill */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">{property.title}</div>
              <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {property.location} · {formatPrice(property.price)}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Visit Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType('Property Visit')}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    visitType === 'Property Visit'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🏢 In-Person Visit
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('Online Meeting')}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    visitType === 'Online Meeting'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  💻 Online Walkthrough
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Specific Inquiries or Timings (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please confirm if society clubhouse and parking spot can be inspected..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
