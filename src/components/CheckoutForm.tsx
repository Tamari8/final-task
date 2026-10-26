import React, { useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Tag,
  CreditCard,
  Banknote,
  Lock,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  CheckoutFormData,
  CheckoutFormErrors,
  CheckoutTouchedFields,
  CompletedOrder,
} from '../types';
import { useCart } from '../hooks/useCart';

export interface CheckoutFormProps {
  onOrderSuccess: (order: CompletedOrder) => void;
}

const INITIAL_FORM_DATA: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  city: 'თბილისი',
  address: '',
  postalCode: '',
  promoCode: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  notes: '',
};

/**
 * Custom Validation Rule #1:
 * Validates Georgian mobile/phone format:
 * Accepts "+995 5XX XX XX XX", "9955XXXXXXXX", or "5XXXXXXXX" (9 digits starting with 5).
 */
export function validateGeorgianPhone(phone: string): string | undefined {
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  if (!digitsOnly) {
    return 'ტელეფონის ნომერი სავალდებულოა.';
  }
  const georgianMobileRegex = /^(\+?995)?5\d{8}$/;
  if (!georgianMobileRegex.test(digitsOnly)) {
    return 'შეიყვანეთ სწორი ქართული მობილურის ნომერი (მაგ: +995 555 12 34 56 ან 555123456).';
  }
  return undefined;
}

/**
 * Custom Validation Rule #2:
 * Validates Promo Code format and checks against active ShopFlow promo codes.
 */
export function validateCustomPromoCode(code: string): string | undefined {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return undefined; // Optional unless typed
  if (!/^[A-Z0-9]{4,15}$/.test(trimmed)) {
    return 'პრომო-კოდი უნდა შედგებოდეს 4-15 ლათინური ასოსა და ციფრისგან.';
  }
  const validCodes = ['SHOPFLOW20', 'SALE10', 'STUDENT15'];
  if (!validCodes.includes(trimmed)) {
    return 'არასწორი პრომო-კოდი. აქტიური კოდებია: SHOPFLOW20, SALE10, STUDENT15.';
  }
  return undefined;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderSuccess }) => {
  const {
    items,
    subtotalAmount,
    discountAmount,
    shippingCost,
    totalAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
    addNotification,
  } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    ...INITIAL_FORM_DATA,
    promoCode: appliedPromo?.code ?? '',
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<CheckoutTouchedFields>({});
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateSingleField = useCallback(
    (name: keyof CheckoutFormData, value: string, currentPaymentMethod: 'card' | 'cash_on_delivery'): string | undefined => {
      switch (name) {
        case 'fullName': {
          const trimmed = value.trim();
          if (!trimmed) return 'სახელი და გვარი სავალდებულოა.';
          if (trimmed.length < 3 || !trimmed.includes(' ')) {
            return 'გთხოვთ მიუთითოთ სრული სახელი და გვარი (მინიმუმ 2 სიტყვა).';
          }
          return undefined;
        }
        case 'email': {
          const trimmed = value.trim();
          if (!trimmed) return 'ელ-ფოსტა სავალდებულოა.';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailRegex.test(trimmed)) {
            return 'გთხოვთ შეიყვანოთ ვალიდური ელ-ფოსტის მისამართი (მაგ: name@example.com).';
          }
          return undefined;
        }
        case 'phone':
          return validateGeorgianPhone(value);
        case 'city':
          if (!value.trim()) return 'ქალაქის მითითება სავალდებულოა.';
          return undefined;
        case 'address':
          if (!value.trim()) return 'მისამართის მითითება სავალდებულოა.';
          if (value.trim().length < 6) {
            return 'გთხოვთ მიუთითოთ ზუსტი მისამართი (ქუჩა, ნომერი).';
          }
          return undefined;
        case 'postalCode':
          if (value.trim() && !/^\d{4,6}$/.test(value.trim())) {
            return 'საფოსტო ინდექსი უნდა შეიცავდეს 4-6 ციფრს (მაგ: 0160).';
          }
          return undefined;
        case 'promoCode':
          return validateCustomPromoCode(value);
        case 'cardNumber': {
          if (currentPaymentMethod !== 'card') return undefined;
          const digits = value.replace(/\s+/g, '');
          if (!digits) return 'ბარათის ნომერი სავალდებულოა.';
          if (!/^\d{16}$/.test(digits)) {
            return 'ბარათის ნომერი უნდა შედგებოდეს 16 ციფრისგან.';
          }
          return undefined;
        }
        case 'cardExpiry': {
          if (currentPaymentMethod !== 'card') return undefined;
          const trimmed = value.trim();
          if (!trimmed) return 'მოქმედების ვადა სავალდებულოა.';
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(trimmed)) {
            return 'ფორმატი: MM/YY (მაგ: 08/28).';
          }
          return undefined;
        }
        case 'cardCvc': {
          if (currentPaymentMethod !== 'card') return undefined;
          const trimmed = value.trim();
          if (!trimmed) return 'CVC კოდი სავალდებულოა.';
          if (!/^\d{3,4}$/.test(trimmed)) {
            return 'CVC უნდა შედგებოდეს 3 ან 4 ციფრისგან.';
          }
          return undefined;
        }
        default:
          return undefined;
      }
    },
    []
  );

  // Clear existing error on input change (per modern-web-guidance Validation Event Timing Matrix)
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof CheckoutFormData;

    let formattedValue = value;
    if (fieldName === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (fieldName === 'cardExpiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      formattedValue =
        digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    } else if (fieldName === 'cardCvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [fieldName]: formattedValue }));

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
    if (fieldName === 'promoCode') {
      setPromoFeedback(null);
    }
  };

  // Validate on blur after user finishes interacting with the field
  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof CheckoutFormData;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldError = validateSingleField(fieldName, value, formData.paymentMethod);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  };

  const handleApplyPromo = () => {
    setTouched((prev) => ({ ...prev, promoCode: true }));
    const customError = validateCustomPromoCode(formData.promoCode);
    if (customError) {
      setErrors((prev) => ({ ...prev, promoCode: customError }));
      setPromoFeedback({ type: 'error', message: customError });
      return;
    }

    const result = applyPromoCode(formData.promoCode);
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, promoCode: result.message }));
      setPromoFeedback({ type: 'error', message: result.message });
    } else {
      setErrors((prev) => ({ ...prev, promoCode: undefined }));
      setPromoFeedback({ type: 'success', message: result.message });
    }
  };

  const handleQuickSelectPromo = (code: string) => {
    setFormData((prev) => ({ ...prev, promoCode: code }));
    setErrors((prev) => ({ ...prev, promoCode: undefined }));
    const result = applyPromoCode(code);
    if (result.valid) {
      setPromoFeedback({ type: 'success', message: result.message });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    const allFields: (keyof CheckoutFormData)[] = [
      'fullName',
      'email',
      'phone',
      'city',
      'address',
      'postalCode',
      'promoCode',
      'cardNumber',
      'cardExpiry',
      'cardCvc',
    ];

    const newErrors: CheckoutFormErrors = {};
    const newTouched: CheckoutTouchedFields = {};

    for (const field of allFields) {
      newTouched[field] = true;
      const errorMsg = validateSingleField(
        field,
        String(formData[field] ?? ''),
        formData.paymentMethod
      );
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      addNotification(
        'შეამოწმეთ ფორმის ველები',
        'გთხოვთ შეავსოთ ყველა სავალდებულო ველი სწორი ფორმატით.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      const completedOrder: CompletedOrder = {
        orderId: `SF-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleString('ka-GE'),
        customer: formData,
        items: [...items],
        subtotal: subtotalAmount,
        discountAmount,
        shippingCost,
        totalAmount,
        appliedPromo,
      };

      clearCart();
      setIsSubmitting(false);
      addNotification(
        'შეკვეთა წარმატებით გაფორმდა!',
        `შეკვეთის ნომერი: ${completedOrder.orderId}`,
        'success'
      );
      onOrderSuccess(completedOrder);
    }, 650);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs"
    >
      {/* Section 1: Customer Contact Info */}
      <fieldset className="space-y-5">
        <legend className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 w-full">
          1. საკონტაქტო ინფორმაცია
        </legend>

        {/* Full Name (Single field per modern-web-guidance) */}
        <div>
          <label
            htmlFor="checkout-fullName"
            className="mb-1.5 block text-xs font-bold text-slate-800"
          >
            სრული სახელი და გვარი <span className="text-rose-600">*</span>
          </label>
          <input
            id="checkout-fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            enterKeyHint="next"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="მაგ: გიორგი ბერიძე"
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : 'fullName-hint'}
            className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
              touched.fullName && errors.fullName
                ? 'border-rose-400 bg-rose-50/40'
                : 'border-slate-300 bg-white focus:border-indigo-600'
            }`}
          />
          {touched.fullName && errors.fullName ? (
            <p
              id="fullName-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.fullName}</span>
            </p>
          ) : (
            <p id="fullName-hint" className="mt-1 text-[11px] text-slate-400">
              მიუთითეთ მიმღების სახელი და გვარი პირადობის მიხედვით.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label
              htmlFor="checkout-email"
              className="mb-1.5 block text-xs font-bold text-slate-800"
            >
              ელ-ფოსტა <span className="text-rose-600">*</span>
            </label>
            <input
              id="checkout-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="next"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="name@example.com"
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
                touched.email && errors.email
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-slate-300 bg-white focus:border-indigo-600'
              }`}
            />
            {touched.email && errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone (Custom Validation #1: Georgian Phone Format) */}
          <div>
            <label
              htmlFor="checkout-phone"
              className="mb-1.5 block text-xs font-bold text-slate-800"
            >
              მობილურის ნომერი (Custom Validation) <span className="text-rose-600">*</span>
            </label>
            <input
              id="checkout-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              enterKeyHint="next"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+995 555 12 34 56"
              aria-invalid={Boolean(touched.phone && errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
              className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
                touched.phone && errors.phone
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-slate-300 bg-white focus:border-indigo-600'
              }`}
            />
            {touched.phone && errors.phone ? (
              <p
                id="phone-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p id="phone-hint" className="mt-1 text-[11px] text-slate-400">
                ფორმატი: +995 5XX XX XX XX ან 5XXXXXXXX
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Section 2: Shipping Address */}
      <fieldset className="space-y-5">
        <legend className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 w-full">
          2. მიწოდების მისამართი
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="checkout-city"
              className="mb-1.5 block text-xs font-bold text-slate-800"
            >
              ქალაქი / რეგიონი <span className="text-rose-600">*</span>
            </label>
            <input
              id="checkout-city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              enterKeyHint="next"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="თბილისი, ბათუმი, ქუთაისი..."
              aria-invalid={Boolean(touched.city && errors.city)}
              aria-describedby={errors.city ? 'city-error' : undefined}
              className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
                touched.city && errors.city
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-slate-300 bg-white focus:border-indigo-600'
              }`}
            />
            {touched.city && errors.city && (
              <p
                id="city-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>

          {/* Optional Postal Code per modern-web-guidance */}
          <div>
            <label
              htmlFor="checkout-postalCode"
              className="mb-1.5 block text-xs font-bold text-slate-800"
            >
              საფოსტო ინდექსი <span className="text-slate-400 font-normal">(არასავალდებულო)</span>
            </label>
            <input
              id="checkout-postalCode"
              name="postalCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              enterKeyHint="next"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0160"
              aria-invalid={Boolean(touched.postalCode && errors.postalCode)}
              aria-describedby={errors.postalCode ? 'postal-error' : undefined}
              className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
                touched.postalCode && errors.postalCode
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-slate-300 bg-white focus:border-indigo-600'
              }`}
            />
            {touched.postalCode && errors.postalCode && (
              <p
                id="postal-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.postalCode}</span>
              </p>
            )}
          </div>
        </div>

        {/* Street Address using textarea per modern-web-guidance Section 9 */}
        <div>
          <label
            htmlFor="checkout-address"
            className="mb-1.5 block text-xs font-bold text-slate-800"
          >
            ზუსტი მისამართი (ქუჩა, კორპუსი, ბინა) <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="checkout-address"
            name="address"
            rows={2}
            required
            autoComplete="street-address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="მაგ: ჭავჭავაძის გამზ. #34, სადარბაზო 2, სართული 5, ბინა 18"
            aria-invalid={Boolean(touched.address && errors.address)}
            aria-describedby={errors.address ? 'address-error' : undefined}
            className={`w-full rounded-xl border px-4 py-2.5 text-base text-slate-900 transition-colors ${
              touched.address && errors.address
                ? 'border-rose-400 bg-rose-50/40'
                : 'border-slate-300 bg-white focus:border-indigo-600'
            }`}
          />
          {touched.address && errors.address && (
            <p
              id="address-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.address}</span>
            </p>
          )}
        </div>
      </fieldset>

      {/* Section 3: Custom Validation #2 — Promo Code Verification */}
      <fieldset className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <legend className="sr-only">პრომო-კოდი და ფასდაკლება</legend>
        <div className="flex items-center justify-between">
          <label
            htmlFor="checkout-promoCode"
            className="flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <Tag className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <span>პრომო-კოდის შემოწმება (Custom Validation)</span>
          </label>
          {appliedPromo && (
            <button
              type="button"
              onClick={() => {
                removePromoCode();
                setFormData((prev) => ({ ...prev, promoCode: '' }));
                setPromoFeedback(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>გაუქმება ({appliedPromo.code})</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            id="checkout-promoCode"
            name="promoCode"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={formData.promoCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="მაგ: SHOPFLOW20"
            aria-invalid={Boolean(errors.promoCode)}
            aria-describedby="promoCode-feedback"
            className="flex-1 min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-semibold uppercase tracking-wider text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="min-h-[48px] rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 transition-colors cursor-pointer shrink-0"
          >
            კოდის შემოწმება
          </button>
        </div>

        {/* Quick-Apply Promo Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-medium text-slate-500">ხელმისაწვდომი კოდები:</span>
          {(['SHOPFLOW20', 'STUDENT15', 'SALE10'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => handleQuickSelectPromo(code)}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                appliedPromo?.code === code
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>{code}</span>
            </button>
          ))}
        </div>

        <div id="promoCode-feedback" aria-live="polite">
          {promoFeedback && (
            <p
              className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${
                promoFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {promoFeedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{promoFeedback.message}</span>
            </p>
          )}
          {!promoFeedback && touched.promoCode && errors.promoCode && (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.promoCode}</span>
            </p>
          )}
        </div>
      </fieldset>

      {/* Section 4: Payment Method (Visible radio controls per modern-web-guidance Selection Control Matrix) */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 w-full">
          3. გადახდის მეთოდი
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label
            htmlFor="payment-card"
            className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
              formData.paymentMethod === 'card'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/15'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              id="payment-card"
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
              className="h-4 w-4 accent-indigo-600"
            />
            <CreditCard className="h-5 w-5 text-indigo-600 shrink-0" aria-hidden="true" />
            <div>
              <span className="block text-sm font-bold text-slate-900">
                საბანკო ბარათით
              </span>
              <span className="block text-xs text-slate-500">
                Visa, Mastercard, Amex
              </span>
            </div>
          </label>

          <label
            htmlFor="payment-cod"
            className={`flex items-center gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
              formData.paymentMethod === 'cash_on_delivery'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/15'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              id="payment-cod"
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={formData.paymentMethod === 'cash_on_delivery'}
              onChange={handleChange}
              className="h-4 w-4 accent-indigo-600"
            />
            <Banknote className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <span className="block text-sm font-bold text-slate-900">
                კურიერთან გადახდა
              </span>
              <span className="block text-xs text-slate-500">
                ნაღდი ანგარიშსწორებით ან ტერმინალით
              </span>
            </div>
          </label>
        </div>

        {/* Card Details Sub-form */}
        {formData.paymentMethod === 'card' && (
          <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <label
                htmlFor="checkout-cardNumber"
                className="mb-1.5 block text-xs font-bold text-slate-800"
              >
                ბარათის 16-ნიშნა ნომერი <span className="text-rose-600">*</span>
              </label>
              <input
                id="checkout-cardNumber"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                enterKeyHint="next"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="4000 1234 5678 9010"
                aria-invalid={Boolean(touched.cardNumber && errors.cardNumber)}
                aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base font-mono tracking-wider text-slate-900 transition-colors ${
                  touched.cardNumber && errors.cardNumber
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-slate-300 bg-white focus:border-indigo-600'
                }`}
              />
              {touched.cardNumber && errors.cardNumber && (
                <p
                  id="cardNumber-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.cardNumber}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-cardExpiry"
                  className="mb-1.5 block text-xs font-bold text-slate-800"
                >
                  ვადა (MM/YY) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-cardExpiry"
                  name="cardExpiry"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  enterKeyHint="next"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="08/28"
                  aria-invalid={Boolean(touched.cardExpiry && errors.cardExpiry)}
                  aria-describedby={errors.cardExpiry ? 'cardExpiry-error' : undefined}
                  className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base font-mono text-slate-900 transition-colors ${
                    touched.cardExpiry && errors.cardExpiry
                      ? 'border-rose-400 bg-rose-50/40'
                      : 'border-slate-300 bg-white focus:border-indigo-600'
                  }`}
                />
                {touched.cardExpiry && errors.cardExpiry && (
                  <p
                    id="cardExpiry-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.cardExpiry}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-cardCvc"
                  className="mb-1.5 block text-xs font-bold text-slate-800"
                >
                  CVC / CVV <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-cardCvc"
                  name="cardCvc"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  enterKeyHint="done"
                  value={formData.cardCvc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123"
                  aria-invalid={Boolean(touched.cardCvc && errors.cardCvc)}
                  aria-describedby={errors.cardCvc ? 'cardCvc-error' : undefined}
                  className={`w-full min-h-[48px] rounded-xl border px-4 py-2.5 text-base font-mono text-slate-900 transition-colors ${
                    touched.cardCvc && errors.cardCvc
                      ? 'border-rose-400 bg-rose-50/40'
                      : 'border-slate-300 bg-white focus:border-indigo-600'
                  }`}
                />
                {touched.cardCvc && errors.cardCvc && (
                  <p
                    id="cardCvc-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.cardCvc}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </fieldset>

      {/* Submit Button (Not disabled before submission per modern-web-guidance Section 4; disabled only while submitting) */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="flex w-full min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-6 py-3.5 text-base font-extrabold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 disabled:opacity-60 transition-all cursor-pointer"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span>
            {isSubmitting
              ? 'მიმდინარეობს შეკვეთის დამუშავება...'
              : `შეკვეთის დადასტურება — $${totalAmount.toFixed(2)}`}
          </span>
        </button>
        <p className="mt-2.5 text-center text-xs text-slate-400">
          უსაფრთხო 256-bit SSL დაშიფვრა • 30-დღიანი დაბრუნების გარანტია
        </p>
      </div>
    </form>
  );
};
