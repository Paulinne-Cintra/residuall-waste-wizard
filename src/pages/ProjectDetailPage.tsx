
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Users, 
  FileText, 
  Download, 
  Upload
} from 'lucide-react';
import Chart from '../components/Chart';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Simulação de dados do projeto
  const projectData = {
    id: id,
    name: 'Edifício Aurora',
    location: 'São Paulo, SP',
    date: '15/05/2023',
    status: 'Em andamento',
    progress: 75,
    responsibleName: 'Carlos Pereira',
    responsibleRole: 'Engenheiro Civil',
    reuseRate: 72,
    team: [
      { id: '1', name: 'Carlos Pereira', role: 'Engenheiro Civil' },
      { id: '2', name: 'Ana Silva', role: 'Arquiteta' },
      { id: '3', name: 'Roberto Santos', role: 'Gerente de Obra' },
      { id: '4', name: 'Fernanda Lima', role: 'Técnica Ambiental' },
    ],
    documents: [
      { id: '1', name: 'Planta Baixa.pdf', date: '10/05/2023' },
      { id: '2', name: 'Relatório Ambiental.pdf', date: '12/05/2023' },
      { id: '3', name: 'Cronograma.pdf', date: '14/05/2023' },
    ],
  };

  // Dados de exemplo para os gráficos
  const wasteByStageData = [
    { name: 'Fundação', value: 15 },
    { name: 'Estrutura', value: 25 },
    { name: 'Alvenaria', value: 35 },
    { name: 'Acabamento', value: 20 },
    { name: 'Instalações', value: 5 },
  ];

  const reusedMaterialsData = [
    { name: 'Concreto', value: 45 },
    { name: 'Madeira', value: 70 },
    { name: 'Metais', value: 80 },
    { name: 'Cerâmica', value: 25 },
    { name: 'Gesso', value: 35 },
  ];

  // Estado para as recomendações
  const [recommendations, setRecommendations] = useState([
    { id: '1', text: 'Reutilize o concreto excedente da fundação para pequenos elementos decorativos.', completed: true },
    { id: '2', text: 'Alto desperdício de cerâmica detectado. Revisar processo de corte.', completed: false },
    { id: '3', text: 'Madeira dos tapumes pode ser reutilizada para formas de concreto menores.', completed: true },
    { id: '4', text: 'Potencial para reduzir em 15% o uso de argamassa com melhor controle de espessura.', completed: false },
  ]);

  // Função para marcar recomendação como concluída
  const toggleRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, completed: !rec.completed } : rec
    ));
  };

  // Componentes para as seções da página
  const ProjectHeader = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-residuall-gray-dark mb-2">
            {projectData.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-residuall-gray space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>{projectData.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>Iniciado em {projectData.date}</span>
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{projectData.responsibleName}</span>
            </div>
          </div>
        </div>
        
        <Link
          to={`/dashboard/projetos/${id}/editar`}
          className="mt-4 md:mt-0 inline-flex items-center bg-residuall-green hover:bg-residuall-green-light text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Edit size={16} className="mr-2" />
          Editar
        </Link>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Progresso da Obra</span>
          <span className="font-medium">{projectData.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-residuall-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${projectData.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const TeamSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4 flex items-center">
        <Users size={20} className="mr-2" />
        Time
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {projectData.team.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-residuall-green bg-opacity-10 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-residuall-green">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-medium text-residuall-gray-dark text-center">
              {member.name}
            </h3>
            <p className="text-sm text-residuall-gray text-center">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-residuall-gray-dark flex items-center">
          <FileText size={20} className="mr-2" />
          Documentos
        </h2>
        
        <div className="flex space-x-2">
          <button className="inline-flex items-center text-sm bg-residuall-green text-white py-1 px-3 rounded-lg">
            <Upload size={14} className="mr-1" />
            Importar
          </button>
          <button className="inline-flex items-center text-sm bg-residuall-gray-dark text-white py-1 px-3 rounded-lg">
            <Download size={14} className="mr-1" />
            Exportar
          </button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-residuall-gray-dark uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projectData.documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText size={16} className="text-residuall-gray mr-2" />
                    <span className="text-sm text-residuall-gray-dark">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-residuall-gray">
                  {doc.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="text-residuall-green hover:text-residuall-green-light mr-3">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ChartsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4">
          Desperdício por Etapa
        </h2>
        <Chart type="pie" data={wasteByStageData} height={250} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4">
          Tipos de Materiais Reutilizados
        </h2>
        <Chart type="pie" data={reusedMaterialsData} height={250} />
      </div>
    </div>
  );

  const RecommendationsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-residuall-gray-dark mb-4">
        Recomendações
      </h2>
      
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <button
              onClick={() => toggleRecommendation(rec.id)}
              className={`shrink-0 p-1 rounded-full mr-3 ${
                rec.completed 
                  ? 'bg-green-100 text-green-500' 
                  : 'bg-residuall-brown bg-opacity-10 text-residuall-brown'
              }`}
            >
              {rec.completed ? (
                <CheckCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </button>
            <div>
              <p className="text-sm text-residuall-gray-dark">{rec.text}</p>
              <p className="text-xs text-residuall-gray mt-1">
                {rec.completed ? 'Concluído' : 'Pendente'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
         
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ProjectHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TeamSection />
            <DocumentsSection />
          </div>
          
          <ChartsSection />
          <RecommendationsSection />
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
