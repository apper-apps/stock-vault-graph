import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import AddCompanyModal from '@/components/organisms/AddCompanyModal';
import companyService from '@/services/api/companyService';
import contactService from '@/services/api/contactService';
import { toast } from 'react-toastify';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showContacts, setShowContacts] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (selectedIndustry) {
        filters.industry = selectedIndustry;
      }
      
      const result = await companyService.getAll(searchTerm, filters);
      setCompanies(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (companyId = null) => {
    try {
      const result = await contactService.getAll('', companyId);
      setContacts(result);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, selectedIndustry]);

  useEffect(() => {
    if (selectedCompany) {
      fetchContacts(selectedCompany.Id);
    }
  }, [selectedCompany]);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsAddModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsAddModalOpen(true);
  };

  const handleDeleteCompany = async (company) => {
    if (window.confirm(`Are you sure you want to delete "${company.name_c}"?`)) {
      const success = await companyService.delete(company.Id);
      if (success) {
        setCompanies(prev => prev.filter(c => c.Id !== company.Id));
        if (selectedCompany?.Id === company.Id) {
          setSelectedCompany(null);
          setShowContacts(false);
        }
      }
    }
  };

  const handleModalSuccess = () => {
    setIsAddModalOpen(false);
    setEditingCompany(null);
    fetchCompanies();
  };

  const handleViewContacts = (company) => {
    setSelectedCompany(company);
    setShowContacts(true);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setShowContacts(false);
  };

  const getUniqueIndustries = () => {
    const industries = companies
      .filter(company => company.industry_c)
      .map(company => company.industry_c.trim())
      .filter(industry => industry.length > 0);
    return [...new Set(industries)].sort();
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchTerm || 
      company.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = !selectedIndustry || 
      company.industry_c?.toLowerCase().includes(selectedIndustry.toLowerCase());
    
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchCompanies} />;
  }

  if (showContacts && selectedCompany) {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={handleBackToCompanies}
            >
              Back to Companies
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {selectedCompany.name_c} - Contacts
              </h1>
              <p className="text-slate-600">
                {selectedCompany.industry_c && `${selectedCompany.industry_c} • `}
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Company Name</h3>
              <p className="text-slate-900">{selectedCompany.name_c}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Industry</h3>
              <p className="text-slate-900">{selectedCompany.industry_c || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Address</h3>
              <p className="text-slate-900">{selectedCompany.address_c || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <Empty
            title="No contacts found"
            description="No contacts are associated with this company yet."
            icon="Users"
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {contacts.map((contact) => (
                    <motion.tr
                      key={contact.Id}
                      className="table-row-hover"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {contact.name_c || 'Unnamed Contact'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {contact.title_c || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.email_c ? (
                          <a 
                            href={`mailto:${contact.email_c}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {contact.email_c}
                          </a>
                        ) : (
                          <span className="text-slate-400">Not specified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.phoneNumber_c ? (
                          <a 
                            href={`tel:${contact.phoneNumber_c}`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {contact.phoneNumber_c}
                          </a>
                        ) : (
                          <span className="text-slate-400">Not specified</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-600">Manage your company database and contacts</p>
        </div>
        <Button icon="Plus" onClick={handleAddCompany}>
          Add Company
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          <div>
            <select
              className="input-field"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {getUniqueIndustries().map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description="Get started by adding your first company to the database."
          actionLabel="Add Company"
          onAction={handleAddCompany}
          icon="Factory"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {filteredCompanies.length} Companies
              </h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCompanies.map((company) => (
                  <motion.tr
                    key={company.Id}
                    className="table-row-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {company.name_c || 'Unnamed Company'}
                      </div>
                      {company.Tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {company.Tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {company.industry_c || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 max-w-xs truncate">
                      {company.address_c || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {company.CreatedOn ? new Date(company.CreatedOn).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewContacts(company)}
                          className="text-primary-600 hover:text-primary-700"
                          title="View Contacts"
                        >
                          <ApperIcon name="Users" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-primary-600 hover:text-primary-700"
                          title="Edit Company"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company)}
                          className="text-error-600 hover:text-error-700"
                          title="Delete Company"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Company Modal */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleModalSuccess}
        company={editingCompany}
      />
    </div>
  );
};

export default Companies;