
import jsPDF from 'jspdf';

export const exportToPDF = (reportData: any[], title: string) => {
  const pdf = new jsPDF();
  
  // Configuração do PDF
  pdf.setFontSize(20);
  pdf.text(title, 20, 20);
  
  // Data de geração
  const currentDate = new Date().toLocaleDateString('pt-BR');
  pdf.setFontSize(12);
  pdf.text(`Gerado em: ${currentDate}`, 20, 35);
  
  // Cabeçalho da tabela
  let yPosition = 55;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  
  if (reportData.length > 0) {
    // Cabeçalhos
    pdf.text('Projeto', 20, yPosition);
    pdf.text('Material', 60, yPosition);
    pdf.text('Desperdício (kg)', 110, yPosition);
    pdf.text('Custo (R$)', 150, yPosition);
    
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    
    // Dados
    reportData.forEach((report) => {
      if (yPosition > 270) { // Nova página se necessário
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(report.project_name.substring(0, 25), 20, yPosition);
      pdf.text(report.material_type_name.substring(0, 25), 60, yPosition);
      pdf.text(report.total_wasted_quantity.toFixed(1), 110, yPosition);
      pdf.text(report.total_economy_generated.toFixed(2), 150, yPosition);
      
      yPosition += 8;
    });
  } else {
    pdf.text('Nenhum dado disponível para relatório.', 20, yPosition);
  }
  
  // Salvar o PDF
  pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${currentDate.replace(/\//g, '-')}.pdf`);
};

export const exportToCSV = (reportData: any[], filename: string) => {
  if (reportData.length === 0) {
    alert('Nenhum dado disponível para exportar.');
    return;
  }

  // Criar cabeçalhos CSV
  const headers = [
    'Projeto',
    'Material',
    'Desperdício Total (kg)',
    'Custo Total (R$)',
    'Data de Criação',
    'Status do Projeto',
    'Localização',
    'Responsável'
  ];

  // Criar linhas de dados
  const csvContent = [
    headers.join(','),
    ...reportData.map(report => [
      `"${report.project_name}"`,
      `"${report.material_type_name}"`,
      report.total_wasted_quantity.toFixed(2),
      report.total_economy_generated.toFixed(2),
      `"${new Date(report.created_at).toLocaleDateString('pt-BR')}"`,
      `"${report.project_status}"`,
      `"${report.project_location}"`,
      `"${report.responsible}"`
    ].join(','))
  ].join('\n');

  // Criar e baixar arquivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
