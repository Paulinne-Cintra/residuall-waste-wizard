
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGlobalSearch, GlobalSearchResult } from '@/hooks/useGlobalSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, Package, BarChart3, Trash2, FolderOpen, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { results, loading, error, search } = useGlobalSearch();

  useEffect(() => {
    if (searchTerm) {
      search(searchTerm);
    }
  }, [searchTerm, search]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'projeto':
        return <FolderOpen className="h-5 w-5" />;
      case 'material':
        return <Package className="h-5 w-5" />;
      case 'relatorio':
        return <BarChart3 className="h-5 w-5" />;
      case 'desperdicio':
        return <Trash2 className="h-5 w-5" />;
      case 'documento':
        return <FileText className="h-5 w-5" />;
      default:
        return <Search className="h-5 w-5" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      projeto: 'Projeto',
      material: 'Material',
      relatorio: 'Relatório',
      desperdicio: 'Desperdício',
      documento: 'Documento'
    };
    return labels[type] || type;
  };

  const getResultTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      projeto: 'bg-blue-100 text-blue-800',
      material: 'bg-green-100 text-green-800',
      relatorio: 'bg-purple-100 text-purple-800',
      desperdicio: 'bg-red-100 text-red-800',
      documento: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getResultLink = (result: GlobalSearchResult) => {
    switch (result.result_type) {
      case 'projeto':
        return `/dashboard/projetos/${result.result_id}`;
      case 'material':
        return `/dashboard/materiais`;
      case 'relatorio':
        return `/dashboard/relatorios/${result.result_id}`;
      case 'desperdicio':
      case 'documento':
        return `/dashboard/projetos`;
      default:
        return '/dashboard';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Resultados da Busca</h1>
          <p className="text-base text-gray-600">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Digite um termo para pesquisar'}
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Erro ao realizar busca: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {searchTerm && !loading && !error && (
        <div className="space-y-4">
          {results.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid gap-4">
                {results.map((result) => (
                  <Card key={`${result.result_type}-${result.result_id}`} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            {getResultIcon(result.result_type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{result.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={getResultTypeColor(result.result_type)}>
                                {getResultTypeLabel(result.result_type)}
                              </Badge>
                              {result.additional_info && (
                                <span className="text-sm text-gray-500">• {result.additional_info}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link to={getResultLink(result)}>
                          <Button variant="outline" size="sm">
                            Ver detalhes
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    
                    {result.description && (
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm">
                          {result.description}
                        </CardDescription>
                        <p className="text-xs text-gray-400 mt-2">
                          Criado em {format(new Date(result.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-500">
                  Não encontramos nenhum resultado para "{searchTerm}". Tente usar outros termos de busca.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Busque em todos os seus dados</h3>
            <p className="text-gray-500">
              Use o campo de busca no cabeçalho para encontrar projetos, materiais, relatórios e muito mais.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResultsPage;
