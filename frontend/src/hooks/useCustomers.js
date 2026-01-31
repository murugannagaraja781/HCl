import { useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomerData, fetchCustomers } from '../redux/slices/customerSlice';

/**
 * Redux-based hook for managing customer data with real API integration
 */
const useCustomers = (searchQuery = '', page = 1, pageSize = 5) => {
    const dispatch = useDispatch();
    const { items: customers, total, pages: totalPages, loading } = useSelector((state) => state.customers);

    useEffect(() => {
        // Fetch from API whenever search/page changes
        dispatch(fetchCustomers({
            search: searchQuery,
            page,
            limit: pageSize
        }));
    }, [dispatch, searchQuery, page, pageSize]);

    const updateCustomer = useCallback((id, updates, logEntry) => {
        dispatch(updateCustomerData({ id, updates, logEntry }));
    }, [dispatch]);

    return {
        customers: customers, // Now directly from state (server-side filtered/paged)
        totalCount: total,
        totalPages,
        loading,
        updateCustomer,
        allCustomers: customers
    };
};

export default useCustomers;
