const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  options = [],
  placeholder = "",
  required = false,
  helpText = "",
}) => {
  const baseInputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm " +
    "focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors";

  if (type === "select") {
    return (
      <div className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          required={required}
          aria-describedby={helpText ? `${name}-help` : undefined}
        >
          <option value="">-- Select {label} --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helpText && (
          <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className="mb-4">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </legend>
          <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${name}-${option.value}`}
                className="flex items-center space-x-2"
              >
                <input
                  id={`${name}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  required={required}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {helpText && (
          <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={baseInputClasses}
        required={required}
        aria-describedby={helpText ? `${name}-help` : undefined}
      />
      {helpText && (
        <p id={`${name}-help`} className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
