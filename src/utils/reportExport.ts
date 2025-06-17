
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ReportData {
  id: string;
  title: string;
  project_name: string;
  totalWaste: number;
  totalCost: number;
  wasteEntries: number;
  created_at: string;
}

export const exportReportToPDF = (report: ReportData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('RESIDUALL - Relatório de Projeto', 20, 30);
  
  // Project info
  doc.setFontSize(12);
  doc.text(`Projeto: ${report.project_name}`, 20, 50);
  doc.text(`Relatório: ${report.title}`, 20, 60);
  doc.text(`Data de Geração: ${new Date(report.created_at).toLocaleDateString('pt-BR')}`, 20, 70);
  
  // Summary data
  doc.text('Resumo:', 20, 90);
  doc.text(`Total de Desperdício: ${report.totalWaste.toFixed(1)} kg`, 20, 100);
  doc.text(`Custo Total: R$ ${report.totalCost.toFixed(2)}`, 20, 110);
  doc.text(`Registros de Desperdício: ${report.wasteEntries}`, 20, 120);
  
  // Footer
  doc.setFontSize(10);
  doc.text('Gerado automaticamente pelo sistema RESIDUALL', 20, 280);
  
  // Download
  doc.save(`relatorio-${report.project_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

export const exportReportToCSV = (report: ReportData) => {
  const csvContent = [
    ['Campo', 'Valor'],
    ['Projeto', report.project_name],
    ['Relatório', report.title],
    ['Data de Geração', new Date(report.created_at).toLocaleDateString('pt-BR')],
    ['Total de Desperdício (kg)', report.totalWaste.toFixed(1)],
    ['Custo Total (R$)', report.totalCost.toFixed(2)],
    ['Registros de Desperdício', report.wasteEntries.toString()]
  ];

  const csvString = csvContent
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-${report.project_name.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
