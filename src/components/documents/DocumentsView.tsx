import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { PropertyDocument } from '../../types';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  MapPin, 
  CheckCircle2, 
  FileCheck,
  Building,
  ShieldCheck
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { properties, documents, addDocument } = useApp();

  const [selectedPropertyId, setSelectedPropertyId] = useState<number>(properties[0]?.id || 101);
  const [docSearch, setDocSearch] = useState('');
  const [docType, setDocType] = useState<PropertyDocument['type']>('Floor Plan');
  const [uploadedName, setUploadedName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const propertyDocuments = documents.filter((d) => d.property_id === selectedPropertyId);

  const filteredDocs = propertyDocuments.filter(
    (d) =>
      d.file_name.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.type.toLowerCase().includes(docSearch.toLowerCase())
  );

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedName) return;

    // Sanitize filename preserving logic from safe_filename in Userdashboard_2cb20653.py
    const cleanName = uploadedName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const randomHash = Math.random().toString(36).substring(2, 10);
    const storedName = `${cleanName.replace(/\.[^/.]+$/, '')}_${randomHash}.pdf`;

    addDocument({
      property_id: selectedProperty.id,
      property: selectedProperty.title,
      location: selectedProperty.location,
      file_name: cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`,
      stored_name: storedName,
      type: docType
    });

    setUploadedName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleDownloadSimulation = (doc: PropertyDocument) => {
    // Generate simple PDF-like blob text for clean download verification
    const blobContent = `ESTATEHUB VERIFIED DOCUMENT ARCHIVE\n=================================\nDocument: ${doc.file_name}\nProperty: ${doc.property}\nLocation: ${doc.location}\nClassification: ${doc.type}\nArchive ID: ${doc.id}\nVerification: Hash Verified SHA-256\n`;
    const blob = new Blob([blobContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Property Documentation Repository
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
              Verified Legal Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search property records, upload cadastral surveys, and download municipal sanction drawings.
          </p>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 shrink-0">Selected Property:</span>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-blue-500"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">{selectedProperty.title}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {selectedProperty.location} · {selectedProperty.area} · Seller: {selectedProperty.seller}
            </p>
          </div>
          <div className="text-right">
            <div className="text-base font-extrabold text-blue-600 tabular-nums">
              {formatPrice(selectedProperty.price)}
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Clear Title
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Sanction Status</span>
            <span className="font-semibold text-slate-800">Commencement Cert (CC) Valid</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">RERA Number</span>
            <span className="font-mono font-semibold text-slate-800">P52100028914</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Occupancy Cert</span>
            <span className="font-semibold text-emerald-600">Full OC Granted</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Vault Files</span>
            <span className="font-semibold text-slate-800 tabular-nums">{propertyDocuments.length} Documents</span>
          </div>
        </div>
      </div>

      {/* Upload Document Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Upload Verified Document
          </h2>
        </div>

        <form onSubmit={handleUploadDocument} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
          <div className="sm:col-span-5">
            <label className="block font-medium text-slate-700 mb-1">Document Title / File Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Wakad_Structural_Stability_Audit.pdf"
              value={uploadedName}
              onChange={(e) => setUploadedName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block font-medium text-slate-700 mb-1">Document Classification</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="Property Agreement">Property Agreement</option>
              <option value="Ownership Document">Ownership Document / 7-12 Extract</option>
              <option value="Sale Deed">Sale Deed / Conveyance</option>
              <option value="Floor Plan">Floor Plan / Sanction Drawing</option>
              <option value="Property Brochure">Property Brochure</option>
              <option value="Other">Other Certificate</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload to Vault</span>
            </button>
          </div>
        </form>

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Document safely encrypted and cataloged under {selectedProperty.title}!</span>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Repository Files ({filteredDocs.length})
            </h2>
            <p className="text-xs text-slate-500">Official certified PDF records for this property</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name or classification..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No matching documents found for <strong>{selectedProperty.title}</strong>.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{doc.file_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {doc.type}
                      </span>
                      <span>·</span>
                      <span>Uploaded {doc.uploaded_at}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">{doc.file_size || '2.4 MB'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadSimulation(doc)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
