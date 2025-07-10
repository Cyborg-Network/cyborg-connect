import React, { useState } from 'react'
import { useKycSubmission } from '../../api/gatekeeper/useKycSubmission'
import Button from '../general/buttons/Button'
import { ROUTES } from '../../../index'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const documentTypes = [
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'ID_CARD', label: 'National ID Card' },
  { value: 'DRIVERS', label: "Driver's License" },
]

const KycForm: React.FC = () => {
  const navigate = useNavigate()
  const { submitKyc, isSubmitting } = useKycSubmission()
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    country: '',
    documentType: 'PASSPORT',
  })
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'document' | 'selfie'
  ) => {
    if (e.target.files && e.target.files[0]) {
      type === 'document'
        ? setDocumentFile(e.target.files[0])
        : setSelfieFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!documentFile || !selfieFile) {
      toast.error('Please upload both document and selfie')
      return
    }

    const formDataObj = new FormData()
    formDataObj.append('email', formData.email)
    formDataObj.append('phone', formData.phone)
    formDataObj.append('country', formData.country)
    formDataObj.append('documentType', formData.documentType)
    formDataObj.append('document', documentFile)
    formDataObj.append('selfie', selfieFile)

    const success = await submitKyc(formDataObj)
    if (success) {
      navigate(ROUTES.DASHBOARD)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-cb-gray-600 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">KYC Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-cb-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-cb-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-cb-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Document Type</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-cb-gray-700 text-white border border-gray-600"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Document Photo</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={e => handleFileChange(e, 'document')}
            required
            className="w-full text-white"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Selfie with Document</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'selfie')}
            required
            className="w-full text-white"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variation="secondary"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            selectable={false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variation="primary"
            disabled={isSubmitting}
            selectable={false}
            onClick={e => {
              // This is needed for the submit button
              if (isSubmitting) {
                e.preventDefault()
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit KYC'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default KycForm
