// Role Selector Component
// Displays available job roles as selectable cards

export default function RoleSelector({ roles, selectedRole, onSelectRole }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelectRole(role.id)}
          className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
            selectedRole === role.id
              ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/20 ring-2 ring-primary-500 ring-offset-2'
              : 'border-white/40 bg-white/60 hover:bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 transition-opacity duration-300 ${
            selectedRole === role.id ? 'opacity-100' : 'group-hover:opacity-50'
          }`} />
          
          <div className="relative z-10">
            <h3 className={`text-lg font-bold mb-2 transition-colors ${
              selectedRole === role.id ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-600'
            }`}>
              {role.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {role.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
