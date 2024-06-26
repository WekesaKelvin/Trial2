import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useReducer, useRef } from 'react';
import { Text, TouchableHighlight, FlatList, Dimensions } from 'react-native';

import RealmContext from '../realm';
import { theme } from '../theme';
import { Recurrence } from '../types/recurrence';
import { Expense } from '../models/expense';
import {
  filterExpensesInPeriod,
  getAverageAmountInPeriod,
} from '../utils/expenses';
import { ReportPage } from '../components/ReportPage';

const { useQuery } = RealmContext;

const PagerReducerActionTypes = {
  SET_RECURRENCE: 'SET_RECURRENCE',
};

function pagerReducer(state, action) {
  switch (action.type) {
    case PagerReducerActionTypes.SET_RECURRENCE:
      var newNumberOfPages = 1;
      switch (action.payload) {
        case Recurrence.Weekly:
          newNumberOfPages = 53;
          break;
        case Recurrence.Monthly:
          newNumberOfPages = 12;
          break;
        case Recurrence.Yearly:
          newNumberOfPages = 1;
          break;
      }

      return {
        ...state,
        recurrence: action.payload,
        numberOfPages: newNumberOfPages,
        page: 0,
      };
    default:
      return state;
  }
}

export const Reports = ({ reportsSheetRef }) => {
  const expenses = useQuery(Expense);
  const listRef = useRef(null);

  const [state, dispatch] = useReducer(pagerReducer, {
    recurrence: Recurrence.Weekly,
    numberOfPages: 53,
  });

  const selectRecurrence = (selectedRecurrence) => {
    dispatch({
      type: PagerReducerActionTypes.SET_RECURRENCE,
      payload: selectedRecurrence,
    });
    reportsSheetRef.current.close();
    listRef.current.scrollToIndex({ index: 0 });
  };

  const data = Array.from({ length: state.numberOfPages }).map((_, page) => {
    const filteredExpenses = filterExpensesInPeriod(
      Array.from(expenses),
      state.recurrence,
      page
    );

    const total =
      filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0) ?? 0;
    const average = getAverageAmountInPeriod(total, state.recurrence);

    return {
      page,
      total,
      average,
      expenses: filteredExpenses,
      recurrence: state.recurrence,
    };
  });

  return (
    <>
      <FlatList
        ref={listRef}
        horizontal
        inverted
        decelerationRate='fast'
        snapToAlignment='start'
        snapToInterval={Dimensions.get('window').width}
        data={data}
        style={{ width: '100%', height: '100%' }}
        renderItem={({ item }) => <ReportPage {...item} />}
      />
      <BottomSheet
        ref={reportsSheetRef}
        index={-1}
        handleStyle={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        handleIndicatorStyle={{ backgroundColor: '#FFFFFF55' }}
        enablePanDownToClose
        snapPoints={['25%', '50%']}
      >
        <BottomSheetFlatList
          style={{ backgroundColor: theme.colors.card }}
          data={[Recurrence.Weekly, Recurrence.Monthly, Recurrence.Yearly]}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={{ paddingHorizontal: 18, paddingVertical: 12 }}
              onPress={() => selectRecurrence(item)}
            >
              <Text
                style={{
                  fontSize: 18,
                  textTransform: 'capitalize',
                  color:
                    state.recurrence === item ? theme.colors.primary : 'white',
                }}
              >
                {item}
              </Text>
            </TouchableHighlight>
          )}
        />
      </BottomSheet>
    </>
  );
};
