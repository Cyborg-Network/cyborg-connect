import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from './buttons/Button';

interface StripePaymentFormProps {
  onSubmit: (paymentMethodId: string) => void;
  processing: boolean;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSubmit, processing }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      return;
    }

    if (paymentMethod) {
      onSubmit(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="border border-gray-600 p-3 rounded-lg">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
            },
          },
        }} />
      </div>
      <Button
        type="submit"
        variation="primary"
        selectable={false}
        additionalClasses="w-full"
        disabled={!stripe || processing}
        onClick={() => {}} 
      >
        {processing ? 'Processing...' : 'Pay with Credit Card'}
      </Button>
    </form>
  );
};

export default StripePaymentForm;