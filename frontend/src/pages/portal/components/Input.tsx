import { FormContextType, InputFieldProps } from "@/types/portal.types";
import { validateField } from "@/validation/portalValidation";


export const renderInputField = (fieldProps: InputFieldProps, formContext: FormContextType) => {
    const { icon: Icon, name, label, type = "text", ...props } = fieldProps;
    const { formData, errors, setFormData, setErrors } = formContext;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    return (

        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 h-5 w-5" />}
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`pl-10 w-full outline-none rounded-lg border ${errors[name] ? 'border-red-500' : 'border-gray-300'}
                        p-3 focus:ring-1 ${errors[name] ? 'focus:ring-red-500 outline-none' : 'focus:ring-blue-500 outline-none'}
                        focus:border-blue-500 hover:border-blue-400 transition-all duration-200 bg-white shadow-sm`}
                    {...props}
                />

            </div>
            {errors[name] && (
                <p className="mt-1 text-sm text-red-500 transition-all duration-200">
                    {errors[name]}
                </p>
            )}
        </div>
    );
};