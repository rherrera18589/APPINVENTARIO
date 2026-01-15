import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const reportService = {
  // Exportar a Excel
  async exportToExcel(data, fileName, sheetName = 'Reporte') {
    try {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      
      // Ajustar ancho de columnas
      const colWidths = Object.keys(data[0] || {}).map(() => 15)
      worksheet['!cols'] = colWidths.map(width => ({ wch: width }))
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Error exportando a Excel:', error)
      throw error
    }
  },

  // Exportar a PDF
  async exportToPDF(title, data, columns, fileName) {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Título
      doc.setFontSize(16)
      doc.text(title, pageWidth / 2, 10, { align: 'center' })

      // Fecha
      doc.setFontSize(10)
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 18, { align: 'center' })

      // Crear tabla manualmente
      let yPosition = 25
      const columnWidth = (pageWidth - 20) / columns.length
      const rowHeight = 7

      // Headers
      doc.setFillColor(59, 130, 246)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')

      columns.forEach((col, idx) => {
        doc.rect(10 + idx * columnWidth, yPosition, columnWidth, rowHeight, 'F')
        doc.text(col, 10 + idx * columnWidth + 2, yPosition + 5)
      })

      yPosition += rowHeight + 2

      // Datos
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(8)

      data.forEach((row, rowIdx) => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 10
        }

        columns.forEach((col, colIdx) => {
          const cellValue = String(row[col] || '')
          doc.text(cellValue, 10 + colIdx * columnWidth + 2, yPosition + 5, { maxWidth: columnWidth - 2 })
        })

        if (rowIdx % 2 === 0) {
          doc.setFillColor(243, 244, 246)
          doc.rect(10, yPosition, pageWidth - 20, rowHeight, 'F')
        }

        yPosition += rowHeight
      })

      doc.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exportando a PDF:', error)
      throw error
    }
  },

  // Exportar elemento HTML a PDF
  async exportHTMLToPDF(elementId, fileName) {
    try {
      const element = document.getElementById(elementId)
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF()
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      doc.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exportando HTML a PDF:', error)
      throw error
    }
  },

  // Generar datos de resumen de inventario
  generateInventorySummary(stock) {
    return stock.map(item => ({
      'Producto': item.product?.name || 'N/A',
      'Depósito': item.warehouse?.name || 'N/A',
      'Cantidad': item.quantity,
      'Última Actualización': new Date(item.updated_at).toLocaleDateString('es-ES'),
    }))
  },

  // Generar datos de movimientos
  generateMovementsReport(movements) {
    return movements.map(item => ({
      'Fecha': new Date(item.created_at).toLocaleDateString('es-ES'),
      'Tipo': item.type,
      'Producto': item.product?.name || 'N/A',
      'Cantidad': item.quantity,
      'Origen': item.from_warehouse?.name || 'N/A',
      'Destino': item.to_warehouse?.name || 'N/A',
      'Observaciones': item.notes || '',
    }))
  },

  // Generar datos de ajustes
  generateAdjustmentsReport(adjustments) {
    return adjustments.map(item => ({
      'Fecha': new Date(item.created_at).toLocaleDateString('es-ES'),
      'Producto': item.product?.name || 'N/A',
      'Depósito': item.warehouse?.name || 'N/A',
      'Cantidad Anterior': item.previous_quantity,
      'Cantidad Nueva': item.new_quantity,
      'Diferencia': item.new_quantity - item.previous_quantity,
      'Motivo': item.reason || '',
      'Realizó': item.created_by?.full_name || 'N/A',
    }))
  },
}
