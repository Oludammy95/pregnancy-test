const FormSection = ({ title, children, icon: Icon }) => {
  // ensure children is always an array
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="h-6 w-6 text-blue-600 mr-3" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div
        className={`grid gap-4 ${
          childArray.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {childArray}
      </div>
    </div>
  );
};

export default FormSection;
