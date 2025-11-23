// Role Selector Component
// Displays available job roles as selectable cards

export default function RoleSelector({ roles, selectedRole, onSelectRole }) {
  const roleIcons = {
    SOFTWARE_ENGINEER: '💻',
    SALES_REPRESENTATIVE: '📊',
    RETAIL_ASSOCIATE: '🛍️',
    PRODUCT_MANAGER: '📱',
    DATA_ANALYST: '📈',
    MARKETING_MANAGER: '📢',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelectRole(role.id)}
          className={`p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
            selectedRole === role.id
              ? 'border-primary-500 bg-primary-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">{roleIcons[role.id] || '💼'}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {role.name}
          </h3>
          <p className="text-sm text-gray-600">{role.description}</p>
        </button>
      ))}
    </div>
  );
}

