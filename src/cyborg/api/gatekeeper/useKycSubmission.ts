import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSubstrateState } from '../../../substrate-lib';

export const useKycSubmission = () => {
  const { currentAccount } = useSubstrateState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitKyc = async (formData: FormData) => {
    if (!currentAccount) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_GATEKEEPER_HTTPS_URL}/submit_kyc`, {
        method: 'POST',
        body: formData,
        headers: {
          'user-account': currentAccount.toString(),
          'email': formData.get('email') as string,
          'phone': formData.get('phone') as string,
          'document-type': formData.get('documentType') as string,
          'country': formData.get('country') as string,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      toast.success('KYC submitted successfully!');
      return true;
    } catch (error) {
      toast.error(`KYC submission failed: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitKyc, isSubmitting };
};