import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Index = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Add Expense"
        onPress={() => navigation.navigate('Add')}
      />
      <Button
        title="Go to Reports"
        onPress={() => navigation.navigate('Reports')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Go to Expenses"
        onPress={() => navigation.navigate('Expenses')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default Index;

