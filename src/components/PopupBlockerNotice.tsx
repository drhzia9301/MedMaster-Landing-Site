import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface PopupBlockerNoticeProps {
  onRetryWithRedirect: () => void;
  onDismiss: () => void;
}

const PopupBlockerNotice: React.FC<PopupBlockerNoticeProps> = ({
  onRetryWithRedirect,
  onDismiss
}) => {
  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Pop-up Blocked
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Your browser blocked the Google Sign-In pop-up. You can try signing in with a redirect instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRetryWithRedirect}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try with Redirect
            </button>
            <button
              onClick={onDismiss}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupBlockerNotice;