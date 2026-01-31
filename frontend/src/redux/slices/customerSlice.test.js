import { describe, it, expect } from 'vitest';
import customerReducer, { updateCustomerData } from './customerSlice';

describe('customerSlice reducer', () => {
    const initialState = {
        items: [
            { id: 1, name: 'John Doe', limitStatus: 'Pending' }
        ],
        loading: false,
        error: null,
    };

    it('should handle updateCustomerData.fulfilled', () => {
        const updates = { limitStatus: 'Approved', approvedLimit: 50000 };
        const actual = customerReducer(initialState, {
            type: 'customers/update/fulfilled',
            payload: { id: 1, updates }
        });

        expect(actual.items[0].limitStatus).toBe('Approved');
        expect(actual.items[0].approvedLimit).toBe(50000);
        expect(actual.loading).toBe(false);
    });

    it('should handle updateCustomerData.pending', () => {
        const actual = customerReducer(initialState, { type: 'customers/update/pending' });
        expect(actual.loading).toBe(true);
    });

    it('should handle updateCustomerData.rejected', () => {
        const actual = customerReducer(initialState, { type: 'customers/update/rejected' });
        expect(actual.loading).toBe(false);
        expect(actual.error).toBe('Failed to update customer');
    });
});
