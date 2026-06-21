import { AlertCircle } from 'lucide-react';

interface AIDiagnosisProps {
  diagnosis: string | null;
}

export function AIDiagnosis({ diagnosis }: AIDiagnosisProps) {
  if (!diagnosis) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Chẩn đoán Nguồn Ô nhiễm (AI)
          </h3>
          <p className="text-blue-800 leading-relaxed">
            <span className="font-medium">Nguyên nhân chính:</span> {diagnosis}
          </p>
        </div>
      </div>
    </div>
  );
}
