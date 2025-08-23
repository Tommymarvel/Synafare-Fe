import { CheckCircle2, X } from 'lucide-react';

export function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-sm p-8 relative text-center shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <CheckCircle2 className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Request Submitted</h2>
        <p className="text-gray-600 mt-2">
          Your quotation request has been sent successfully
        </p>
      </div>
    </div>
  );
}
