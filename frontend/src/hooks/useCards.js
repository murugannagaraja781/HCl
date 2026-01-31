import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCards, addCard as addCardThunk } from '../redux/slices/cardSlice';

/**
 * Redux-based hook for managing credit card products
 */
const useCards = (searchQuery = '') => {
    const dispatch = useDispatch();
    const { items: cards, loading, error } = useSelector((state) => state.cards);

    useEffect(() => {
        if (cards.length === 0) {
            dispatch(fetchCards());
        }
    }, [dispatch, cards.length]);

    const filteredCards = useMemo(() => {
        if (!searchQuery) return cards;
        return cards.filter(card =>
            card.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.cardType.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cards, searchQuery]);

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
        cards: filteredCards,
        loading,
        error,
        refresh: () => dispatch(fetchCards()),
        addCard
    };
};

export default useCards;
