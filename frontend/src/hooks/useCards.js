import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCards, addCard as addCardThunk } from '../redux/slices/cardSlice';

/**
 * Redux-based hook for managing credit card products
 */
const useCards = () => {
    const dispatch = useDispatch();
    const { items: cards, loading, error } = useSelector((state) => state.cards);

    useEffect(() => {
        if (cards.length === 0) {
            dispatch(fetchCards());
        }
    }, [dispatch, cards.length]);

    const addCard = useCallback(async (cardData) => {
        const resultAction = await dispatch(addCardThunk(cardData));
        if (addCardThunk.fulfilled.match(resultAction)) {
            return { success: true };
        } else {
            return {
                success: false,
                message: resultAction.payload || 'Failed to add card'
            };
        }
    }, [dispatch]);

    return {
        cards,
        loading,
        error,
        refresh: () => dispatch(fetchCards()),
        addCard
    };
};

export default useCards;
