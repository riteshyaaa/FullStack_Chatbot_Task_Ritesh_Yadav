import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ICreateEnquiryInput, UserType } from '../../types';
import { validateEnquiryForm } from '../../validators/enquiryValidator';
import { useToast } from '../../contexts/ToastContext';
import { enquiryService } from '../../services/enquiryService';

interface EnquiryFormProps {
  initialValues?: Partial<ICreateEnquiryInput>;
  onSuccess?: () => void;
  className?: string;
  isCompact?: boolean;
}

const SERVICE_OPTIONS = [
  'DGCA Small & Medium RPC Certification',
  'GIS & Photogrammetry 3D Mapping',
  'Precision Agriculture & Spraying',
  'Thermal & Industrial Inspection',
  'Aerial Cinematography & FPV',
  'Enterprise Fleet Solutions',
  'Topographical & Land Survey',
  'Infrastructure & Powerline Audit',
  'Mining & Volumetric Measurement',
  'Custom Mission / Consulting',
  'Other Inquiry',
];

const USER_TYPE_OPTIONS: Array<{ label: string; value: UserType }> = [
  { label: 'Commercial Customer (Services / Fleet)', value: 'Customer' },
  { label: 'Student / Aspiring Drone Pilot', value: 'Student' },
  { label: 'Enterprise / Organization', value: 'Customer' },
  { label: 'Training Applicant', value: 'Student' },
  { label: 'Other / General Partner', value: 'Other' },
];

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialValues,
  onSuccess,
  className = '',
  isCompact = false,
}) => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState<ICreateEnquiryInput>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    userType: initialValues?.userType || 'Customer',
    serviceInterest: initialValues?.serviceInterest || '',
    message: initialValues?.message || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation if touched
    if (touched[name]) {
      const validation = validateEnquiryForm({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateEnquiryForm(formData);
    setErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      userType: true,
      serviceInterest: true,
      message: true,
    });

    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toastError('Please fix the errors in the form before submitting.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await enquiryService.createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        userType: formData.userType,
        serviceInterest: formData.serviceInterest?.trim() || undefined,
        message: formData.message.trim(),
      });

      if (response.success) {
        setIsSubmitted(true);
        success(
          'Your inquiry has been submitted! Our flight ops & admissions team will contact you shortly.',
          'Enquiry Received'
        );
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        toastError(response.message || 'Failed to submit enquiry', 'Submission Error');
      }
    } catch (err: any) {
      toastError(
        err.message || 'Unable to submit enquiry. Please check your connection and try again.',
        'Network Error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 px-4 space-y-4 bg-white rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A]">Thank You!</h3>
        <p className="text-sm text-[#475569] max-w-sm mx-auto leading-relaxed">
          We have successfully received your details. A Vayudhara counselor or flight operations manager will
          reach out to you within 2 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              userType: 'Customer',
              serviceInterest: '',
              message: '',
            });
            setTouched({});
            setErrors({});
          }}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#0788C9] bg-[#0788C9]/10 hover:bg-[#0788C9]/20 rounded-xl transition-colors cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} noValidate>
      {/* Name and Email Grid */}
      <div className={`grid grid-cols-1 ${isCompact ? 'gap-3' : 'sm:grid-cols-2 gap-4'}`}>
        <div>
          <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
            Full Name <span className="text-rose-500 font-bold ml-0.5">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. Sarah Connor"
            className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 transition-all duration-150 ${
              errors.name && touched.name
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#CBD5E1] focus:border-[#0788C9] focus:ring-[#0788C9]/15 shadow-xs'
            }`}
          />
          {errors.name && touched.name && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
            Email Address <span className="text-rose-500 font-bold ml-0.5">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. sarah@example.com"
            className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 transition-all duration-150 ${
              errors.email && touched.email
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#CBD5E1] focus:border-[#0788C9] focus:ring-[#0788C9]/15 shadow-xs'
            }`}
          />
          {errors.email && touched.email && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone and UserType Grid */}
      <div className={`grid grid-cols-1 ${isCompact ? 'gap-3' : 'sm:grid-cols-2 gap-4'}`}>
        <div>
          <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
            Phone Number <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+91 98765 43210"
            className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 transition-all duration-150 ${
              errors.phone && touched.phone
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#CBD5E1] focus:border-[#0788C9] focus:ring-[#0788C9]/15 shadow-xs'
            }`}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
            I am a <span className="text-rose-500 font-bold ml-0.5">*</span>
          </label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#0788C9] focus:ring-4 focus:ring-[#0788C9]/15 transition-all duration-150 cursor-pointer shadow-xs"
          >
            {USER_TYPE_OPTIONS.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Service or Course of Interest */}
      <div>
        <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
          Service or Course of Interest
        </label>
        <select
          name="serviceInterest"
          value={formData.serviceInterest}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:border-[#0788C9] focus:ring-4 focus:ring-[#0788C9]/15 transition-all duration-150 cursor-pointer shadow-xs"
        >
          <option value="">Select a service or course of interest...</option>
          {SERVICE_OPTIONS.map((service, idx) => (
            <option key={idx} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.serviceInterest && touched.serviceInterest && (
          <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.serviceInterest}
          </p>
        )}
      </div>

      {/* Message & Project Details */}
      <div>
        <label className="block text-[13px] sm:text-sm font-semibold text-[#0F172A] mb-1.5">
          Message & Project Details <span className="text-rose-500 font-bold ml-0.5">*</span>
        </label>
        <textarea
          name="message"
          rows={isCompact ? 3 : 4}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please describe your requirements, project scope, timeline, or training queries..."
          className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 transition-all duration-150 resize-y min-h-[110px] sm:min-h-[120px] ${
            errors.message && touched.message
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-[#CBD5E1] focus:border-[#0788C9] focus:ring-[#0788C9]/15 shadow-xs'
          }`}
        />
        {errors.message && touched.message && (
          <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl bg-[#0788C9] hover:bg-[#0674AC] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#0788C9]/25 hover:shadow-lg hover:shadow-[#0788C9]/35 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Enquiry...</span>
          </>
        ) : (
          <>
            <span>Submit Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
