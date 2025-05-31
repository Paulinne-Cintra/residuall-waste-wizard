
import React from 'react';
import CreateProjectForm from '@/components/forms/CreateProjectForm';

const CreateProjectPage: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Novo Projeto</h1>
        <p className="text-base text-gray-600">
          Registre um novo projeto de construção e configure o acompanhamento de desperdícios
        </p>
      </div>
      
      <CreateProjectForm />
    </main>
  );
};

export default CreateProjectPage;
