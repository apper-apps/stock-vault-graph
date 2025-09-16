import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import companyService from '@/services/api/companyService';

const AddCompanyModal = ({ isOpen, onClose, onSuccess, company = null }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    address_c: '',
    industry_c: '',
    Tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!company;

  // Reset form when modal opens/closes or company changes
  useEffect(() => {
    if (isOpen) {
      if (company) {
        setFormData({
          name_c: company.name_c || '',
          address_c: company.address_c || '',
          industry_c: company.industry_c || '',
          Tags: company.Tags || ''
        });
      } else {
        setFormData({
          name_c: '',
          address_c: '',
          industry_c: '',
          Tags: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Company name is required';
    }
    
    if (!formData.industry_c.trim()) {
      newErrors.industry_c = 'Industry is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (isEditing) {
        result = await companyService.update(company.Id, formData);
      } else {
        result = await companyService.create(formData);
      }
      
      if (result) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {isEditing ? 'Edit Company' : 'Add New Company'}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Company Name *"
                  name="name_c"
                  value={formData.name_c}
                  onChange={handleChange}
                  error={errors.name_c}
                  placeholder="Enter company name"
                  disabled={loading}
                />
                
                <Input
                  label="Industry *"
                  name="industry_c"
                  value={formData.industry_c}
                  onChange={handleChange}
                  error={errors.industry_c}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  disabled={loading}
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address_c"
                    value={formData.address_c}
                    onChange={handleChange}
                    placeholder="Enter company address"
                    disabled={loading}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border rounded-md transition-colors duration-150 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 border-slate-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                  />
                </div>
                
                <Input
                  label="Tags"
                  name="Tags"
                  value={formData.Tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas"
                  helper="Use commas to separate multiple tags"
                  disabled={loading}
                />
                
                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={loading}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    {isEditing ? 'Update Company' : 'Add Company'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddCompanyModal;