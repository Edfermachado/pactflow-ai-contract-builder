import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCategory, generateSummary } from '@/lib/utils';
import { Invoice } from '@/lib/types';

describe('Utils Functions', () => {
  it('formatCurrency should format USD correctly', () => {
    expect(formatCurrency(150.5, 'USD')).toContain('$150.50');
  });

  it('formatCurrency should format Bs correctly', () => {
    expect(formatCurrency(150.5, 'Bs')).toBe('Bs 150.50');
  });

  it('formatCategory should return the properly capitalized category', () => {
    expect(formatCategory('software')).toBe('Software');
    expect(formatCategory('servicios')).toBe('Servicios');
  });

  it('generateSummary should calculate totals and counts correctly', () => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        emisor: 'A',
        rif: 'J-1',
        fecha_emision: null,
        fecha_pago: null,
        concepto: '',
        subtotal: 100,
        iva: 16,
        total: 116,
        categoria: 'software',
        estado_pago: 'pagada',
        moneda: 'USD',
        metodo_pago: '',
        items: []
      },
      {
        id: '2',
        emisor: 'B',
        rif: 'J-2',
        fecha_emision: null,
        fecha_pago: null,
        concepto: '',
        subtotal: 50,
        iva: 0,
        total: 50,
        categoria: 'oficina',
        estado_pago: 'pendiente',
        moneda: 'USD',
        metodo_pago: '',
        items: []
      }
    ];

    const summary = generateSummary(mockInvoices);
    
    expect(summary.total).toBe(166);
    expect(summary.ivaTotal).toBe(16);
    expect(summary.count).toBe(2);
    expect(summary.pagadas).toBe(1);
    expect(summary.pendientes).toBe(1);
  });
});
