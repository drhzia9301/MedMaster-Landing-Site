import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Banknote,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { paymentService, PaymentMethodOption, PaymentSession } from '../services/paymentService';
import LoadingSpinner from './LoadingSpinner';

interface PaymentMethodSelectorProps {
  planId: number;
  planName: string;
  planPrice: number;
  onPaymentInitiated?: (session: PaymentSession) => void;
  onError?: (error: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  planId,
  planName,
  planPrice,
  onPaymentInitiated,
  onError
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await paymentService.getAvailablePaymentMethods();
      setPaymentMethods(methods);
      // Auto-select first available method
      if (methods.length > 0 && methods[0].available) {
        setSelectedMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentSession(null); // Clear previous session
  };

  const handleProceedToPayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      const session = await paymentService.createPaymentSession(planId, selectedMethod);
      
      if (session.success) {
        setPaymentSession(session);
        onPaymentInitiated?.(session);
        
        // If it's a direct URL (Paddle), redirect immediately
        if (session.url && selectedMethod.includes('paddle')) {
          window.location.href = session.url;
        }
      } else {
        const errorMsg = session.error || 'Failed to create payment session';
        toast.error(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Payment initialization failed';
      toast.error(errorMsg);
      onError?.(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const getMethodIcon = (method: PaymentMethodOption) => {
    switch (method.type) {
      case 'card':
        return method.id.includes('paddle') ? 
          <Globe className="w-6 h-6" /> : 
          <CreditCard className="w-6 h-6" />;
      case 'bank':
        return <Banknote className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getMethodColor = (method: PaymentMethodOption) => {
    if (method.id.includes('payfast')) {
      return 'border-blue-500 bg-blue-50';
    } else if (method.id.includes('paddle')) {
      return 'border-green-500 bg-green-50';
    }
    return 'border-gray-300 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" color="blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Selected Plan</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{planName}</span>
          <span className="text-xl font-bold text-gray-900">₨{planPrice}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? `${getMethodColor(method)} border-opacity-100`
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.available && handlePaymentMethodSelect(method.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  selectedMethod === method.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {getMethodIcon(method)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    {method.id.includes('payfast') && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        PayFast
                      </span>
                    )}
                    {method.id.includes('paddle') && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Paddle
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  {!method.available && (
                    <div className="flex items-center space-x-1 mt-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600">Currently unavailable</span>
                    </div>
                  )}
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PayFast Payment Details */}
      {paymentSession && selectedMethod.includes('payfast') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Payment Instructions</h4>
          
          {paymentSession.qrCode && (
            <div className="mb-4">
              <p className="text-sm text-blue-800 mb-2">Scan QR Code to Pay:</p>
              <div className="bg-white p-3 rounded-lg inline-block">
                <img src={paymentSession.qrCode} alt="Payment QR Code" className="w-32 h-32" />
              </div>
            </div>
          )}
          
          {paymentSession.bankDetails && (
            <div className="mb-4">
              <p className="text-sm text-blue-800 mb-2">Bank Transfer Details:</p>
              <div className="bg-white p-3 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Number:</span>
                  <span className="text-sm">{paymentSession.bankDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bank Name:</span>
                  <span className="text-sm">{paymentSession.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Title:</span>
                  <span className="text-sm">{paymentSession.bankDetails.accountTitle}</span>
                </div>
              </div>
            </div>
          )}
          
          {paymentSession.url && (
            <div>
              <a
                href={paymentSession.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Complete Payment
              </a>
            </div>
          )}
        </div>
      )}

      {/* Proceed Button */}
      {!paymentSession && (
        <button
          onClick={handleProceedToPayment}
          disabled={!selectedMethod || processing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {processing ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Processing...</span>
            </div>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      )}
    </div>
  );
};

export default PaymentMethodSelector;