import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const CATEGORY_ICONS = {
  Salgados: 'local-pizza',
  Doces: 'cake',
  Bebidas: 'local-drink',
  Padaria: 'bakery-dining',
};

const CartScreen = ({ route }) => {
  const { cartItems: initialCartItems } = route.params;
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  const getCategoryIcon = (category) => CATEGORY_ICONS[category] || 'fastfood';

  // Funções de manipulação do carrinho (mantidas do original)
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.id !== product.id);
    });
  };

  const deleteFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleFinalizePurchase = () => {
    if (!selectedPayment) {
      Alert.alert('Atenção', 'Selecione uma forma de pagamento');
      return;
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('Dashboard', { clearCart: true });
  };

  const paymentOptions = [
    { id: 'dinheiro', icon: 'attach-money', text: 'Em dinheiro/Pagamento no Balcão' },
    { id: 'pix', icon: 'qr-code', text: 'Pix' },
    { id: 'cartao', icon: 'credit-card', text: 'Cartão de Débito/Crédito' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista de itens */}
      <ScrollView 
        style={styles.itemsContainer}
        contentContainerStyle={{ paddingBottom: 340 }} // Espaço para o footer
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="remove-shopping-cart" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.iconContainer}>
                <Icon 
                  name={getCategoryIcon(item.category)} 
                  size={30} 
                  style={styles.categoryIcon} 
                />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => removeFromCart(item)}
                  >
                    <Icon name="remove" size={20} color="#0FC2C0" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => addToCart(item)}
                  >
                    <Icon name="add" size={20} color="#0FC2C0" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteFromCart(item.id)}
              >
                <Icon name="delete" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Container de pagamento com valor total integrado */}
      {cartItems.length > 0 && (
        <View style={styles.paymentFooter}>
          {/* Valor Total */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>VALOR TOTAL:</Text>
            <Text style={styles.summaryPrice}>
              R$ {totalPrice.toFixed(2).replace('.', ',')} • {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Formas de pagamento */}
          <Text style={styles.paymentTitle}>Forma de pagamento</Text>
          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.paymentOption}
              onPress={() => setSelectedPayment(option.id)}
            >
              <Icon 
                name={option.icon} 
                size={22} 
                color="#555" 
                style={styles.paymentIcon} 
              />
              <Text style={styles.paymentText}>{option.text}</Text>
              <View style={styles.checkboxContainer(selectedPayment === option.id)}>
                {selectedPayment === option.id && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Botão finalizar */}
          <TouchableOpacity 
            style={styles.finalizeButton}
            onPress={handleFinalizePurchase}
          >
            <Text style={styles.finalizeText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de confirmação */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>Compra finalizada!</Text>
            <Text style={styles.modalText}>
              Pagamento via {selectedPayment === 'dinheiro' ? 'Dinheiro' : 
                           selectedPayment === 'pix' ? 'Pix' : 'Cartão'}
            </Text>
            <Text style={styles.modalTotal}>
              Total: R$ {totalPrice.toFixed(2).replace('.', ',')}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingVertical:35,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 100,
  },
  continueShoppingButton: {
    backgroundColor: '#0FC2C0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  continueShoppingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 128, 127, 0.06)',
  },
  categoryIcon: {
    color: 'rgba(0, 0, 0, 0.84)',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#0FC2C0',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FC2C0',
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
    paddingTop: 28 ,
    marginLeft: 10,
  },
  paymentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0FC2C0',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: (isSelected) => ({
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0FC2C0',
    backgroundColor: isSelected ? '#0FC2C0' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  finalizeButton: {
    backgroundColor: '#0FC2C0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  finalizeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#0FC2C0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;