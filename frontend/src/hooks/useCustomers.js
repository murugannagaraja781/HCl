import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomerData } from '../redux/slices/customerSlice';

/**
 * Redux-based hook for managing customer data with pagination and search
 */
const useCustomers = (searchQuery = '', page = 1, pageSize = 5) => {
    const dispatch = useDispatch();
    const { items: customers } = useSelector((state) => state.customers);

    const updateCustomer = useCallback((id, updates) => {
        dispatch(updateCustomerData({ id, updates }));
    }, [dispatch]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        );
    }, [searchQuery, customers]);

    const totalPages = Math.ceil(filteredCustomers.length / pageSize);
    const paginatedCustomers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredCustomers.slice(start, start + pageSize);
    }, [filteredCustomers, page, pageSize]);

    return {
        customers: paginatedCustomers,
        totalCount: filteredCustomers.length,
        totalPages,
        updateCustomer,
        allCustomers: customers
    };
};

export default useCustomers;
