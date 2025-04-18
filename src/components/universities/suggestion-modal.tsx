'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { XIcon } from '@/components/ui/icons';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SuggestionModal({ isOpen, onClose, onSuccess }: SuggestionModalProps) {
  // State for countries data
  const [countries, setCountries] = useState<Country[]>([]);
  // State for user session
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // Ref for the dialog element
  const modalRef = useRef<HTMLDialogElement>(null);
  
  // Form state
  const [suggestionForm, setSuggestionForm] = useState({
    name: '',
    city: '',
    countryId: '',
    website: '',
    submitterEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  // Handle modal open/close
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  // Handle dialog close event
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const handleClose = () => {
      if (isOpen) {
        onClose();
      }
    };

    modalElement.addEventListener('close', handleClose);
    return () => {
      modalElement.removeEventListener('close', handleClose);
    };
  }, [isOpen, onClose]);

  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, code')
        .order('name');
      
      if (!error && data) {
        setCountries(data);
      } else {
        console.error('Error loading countries:', error);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch user session to get email
  useEffect(() => {
    const fetchUserSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session?.user?.email) {
        setUserEmail(data.session.user.email);
        // Auto-fill the email field in the form
        setSuggestionForm(prev => ({
          ...prev,
          submitterEmail: data.session.user.email
        }));
      }
    };
    
    fetchUserSession();
  }, []);

  // Handle suggestion form changes
  const handleSuggestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSuggestionForm(prev => ({
      ...prev,
      [name]: value
    }));
    setFormTouched(true);
  };

  // Handle university suggestion form submission
  const handleSuggestUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!suggestionForm.name || !suggestionForm.countryId || !suggestionForm.submitterEmail) {
      setSubmitError('Please fill out all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const supabase = createClient();
      
      // Insert the suggestion into a 'university_suggestions' table
      const { error } = await supabase
        .from('university_suggestions')
        .insert({
          name: suggestionForm.name,
          city: suggestionForm.city,
          country_id: suggestionForm.countryId,
          website: suggestionForm.website,
          submitter_email: suggestionForm.submitterEmail,
          status: 'pending' // Initial status
        });
      
      if (error) throw error;
      
      // Show success message
      setSubmitSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form after brief delay
      setTimeout(() => {
        setSuggestionForm({
          name: '',
          city: '',
          countryId: '',
          website: '',
          submitterEmail: userEmail || ''
        });
        setFormTouched(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting university suggestion:', error);
      setSubmitError('Failed to submit suggestion. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form and state when closing
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form and state after a short delay
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitError(null);
        setSuggestionForm({
          name: '',
          city: '',
          countryId: '',
          website: '',
          submitterEmail: userEmail || ''
        });
        setFormTouched(false);
      }, 300);
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {/* Close button */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            disabled={isSubmitting}
            onClick={(e) => {
              if (isSubmitting) {
                e.preventDefault();
              }
            }}
          >
            ✕
          </button>
        </form>

        {submitSuccess ? (
          <div className="text-center py-6">
            <div className="bg-success/10 text-success mb-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-2">Thank you for your suggestion!</h3>
            <p className="text-base-content/70 mb-6">
              We'll review your submission and add it to our database if it meets our criteria.
            </p>
            <button
              onClick={handleClose}
              className="btn btn-primary px-6"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-xl mb-2">Suggest a University</h3>
            <p className="text-base-content/70 mb-6">
              Can't find a university in our database? Suggest it here, and we'll review your submission.
            </p>
            
            <form onSubmit={handleSuggestUniversity} className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text font-medium">University Name*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={suggestionForm.name}
                  onChange={handleSuggestionChange}
                  placeholder="Enter the university name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="city">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={suggestionForm.city}
                  onChange={handleSuggestionChange}
                  placeholder="Enter the city where the university is located"
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="countryId">
                  <span className="label-text font-medium">Country*</span>
                </label>
                <select
                  id="countryId"
                  name="countryId"
                  value={suggestionForm.countryId}
                  onChange={handleSuggestionChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="website">
                  <span className="label-text font-medium">Website URL</span>
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={suggestionForm.website}
                  onChange={handleSuggestionChange}
                  placeholder="https://university-website.edu"
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="submitterEmail">
                  <span className="label-text font-medium">Your Email*</span>
                </label>
                <input
                  type="email"
                  id="submitterEmail"
                  name="submitterEmail"
                  value={suggestionForm.submitterEmail}
                  onChange={handleSuggestionChange}
                  placeholder="your.email@example.com"
                  className={`input input-bordered w-full ${userEmail ? 'bg-base-200/50' : ''}`}
                  required
                  readOnly={!!userEmail}
                  disabled={!!userEmail}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {userEmail 
                      ? "We'll use your email to notify you when the university is added" 
                      : "We'll notify you when your suggestion is approved"}
                  </span>
                </label>
              </div>
              
              {submitError && (
                <div className="alert alert-error shadow-sm flex items-center gap-3 text-sm">
                  <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}
              
              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Suggestion'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose} disabled={isSubmitting}>close</button>
      </form>
    </dialog>
  );
}