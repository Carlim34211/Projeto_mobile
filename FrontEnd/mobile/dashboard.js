import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute  } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

const Dashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.clearCart) {
        setCartItems([]);
        navigation.setParams({ clearCart: false });
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params]);
  

  const categories = [
    { name: 'Todos', icon: 'apps' },
    { name: 'Salgados', icon: 'local-pizza' },
    { name: 'Doces', icon: 'cake' },
    { name: 'Bebidas', icon: 'local-drink' },
    
  ];

  const [products] = useState([
    { id: 1, name: 'Pão Francês', price: 'R$ 0,50', category: 'Salgados' },
    { id: 2, name: 'Bolo de Chocolate', price: 'R$ 15,00', category: 'Doces' },
    { id: 3, name: 'Croissant', price: 'R$ 4,50', category: 'Salgados' },
    { id: 4, name: 'Torta de Frango', price: 'R$ 8,00', category: 'Salgados' },
    { id: 5, name: 'Café Especial', price: 'R$ 5,00', category: 'Bebidas' },
    { id: 6, name: 'Sonho', price: 'R$ 3,50', category: 'Doces' },
    { id: 7, name: 'Pão de Queijo', price: 'R$ 1,00', category: 'Salgados' },
    { id: 8, name: 'Biscoito Caseiro', price: 'R$ 2,50', category: 'Doces' },
    { id: 9, name: 'Suco Natural', price: 'R$ 6,00', category: 'Bebidas' },
    { id: 10, name: 'Empada', price: 'R$ 3,00', category: 'Salgados' },
  ]);
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : 'fastfood'; // Ícone padrão se não encontrar
  };

  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Função para buscar imagens
  const fetchProductImages = async () => {
    setLoadingImages(true);
    
    try {
      const productsWithImages = await Promise.all(
        baseProducts.map(async (product) => {
          try {
            const response = await fetch(
              `https://serpapi.com/search.json?q=${encodeURIComponent(product.name)}+food&tbm=isch&ijn=0&api_key=${SERPAPI_KEY}`
            );
            const data = await response.json();
            
            return {
              ...product,
              imageUrl: data.images_results?.[0]?.thumbnail || 'https://via.placeholder.com/100'
            };
          } catch (error) {
            console.error(`Error fetching image for ${product.name}:`, error);
            return {
              ...product,
              imageUrl: 'https://via.placeholder.com/100'
            };
          }
        })
      );
      
      setProducts(productsWithImages);
      setFilteredProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching product images:', error);
      // Fallback para os produtos sem imagens
      const productsWithPlaceholders = baseProducts.map(product => ({
        ...product,
        imageUrl: 'https://via.placeholder.com/100'
      }));
      setProducts(productsWithPlaceholders);
      setFilteredProducts(productsWithPlaceholders);
    } finally {
      setLoadingImages(false);
    }
  };

  // Buscar imagens quando o componente montar
  useEffect(() => {
    fetchProductImages();
  }, []);
  
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

  useEffect(() => {
    let results = products;
    
    if (searchQuery) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Todos') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory]);

  const renderItem = ({ item }) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    const itemQuantity = cartItem ? cartItem.quantity : 0;
    const categoryIcon = getCategoryIcon(item.category);
     
    
    return (
      <Animated.View style={styles.productCard}>
        <View style={styles.iconContainer}>
          <Icon 
          name={categoryIcon} 
          size={40} 
          color="#0FC2C0" 
          style={styles.categoryIcon}
          />
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>

        <View style={styles.cartControls}>
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={() => addToCart(item)}
          >
            <Icon name="add-shopping-cart" size={24} color="#0FC2C0" />
          </TouchableOpacity>
          
          {itemQuantity > 0 && (
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => removeFromCart(item)}
            >
              <Icon name="remove-shopping-cart" size={24} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return sum + (price * (item.quantity || 1));
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Itens do Menu"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Carrinho', { cartItems })}
          style={styles.headerCartIcon}
        >
          <Icon name="shopping-cart" size={26} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Menu Lateral Esquerdo */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Categorias</Text>
            </View>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryMenuItem,
                  selectedCategory === category.name && styles.selectedCategoryItem
                ]}
                onPress={() => {
                  setSelectedCategory(category.name);
                  setMenuVisible(false);
                }}
              >
                <Icon 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.name ? '#0FC2C0' : '#333'} 
                />
                <Text style={styles.categoryMenuText}>{category.name}</Text>
                {selectedCategory === category.name && (
                  <Icon name="check" size={20} color="#0FC2C0" />
                )}
              </TouchableOpacity>
            ))}
            
            <View style={styles.divider} />
            
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Conta');
              }}
            >
              <Icon name="account-circle" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Minha Conta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Configuracões');
              }}
            >
              <Icon name="settings" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Configurações</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Sobre');
              }}
            >
              <Icon name="info" size={24} color="#333" />
              <Text style={styles.menuOptionText}>Sobre</Text>
            </TouchableOpacity>
          </View>
          
          <Pressable 
            style={styles.menuOverlay} 
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>

      {/* Lista de Produtos */}
      <AnimatedFlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      {/* Resumo do pedido (aparece apenas quando há itens) */}
      {totalItems > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryText}>VALOR TOTAL:</Text>
            <Text style={styles.summaryPrice}>R$ {totalPrice.toFixed(2)} / {totalItems} {totalItems === 1 ? 'Item' : 'Itens'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.cartButtonSummary}
            onPress={() => navigation.navigate('Carrinho', { cartItems })}
          >
            <Text style={styles.cartButtonText}>
              Ver Carrinho ({totalItems})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 35,
    backgroundColor: 'rgba(4, 245, 213, 0.51)',
    marginBottom: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgb(245, 245, 245)',
    borderRadius: 20,
    paddingHorizontal: 25,
    fontSize: 16,
    marginRight: 15,
    marginTop:7,
  },
  headerCartIcon: {
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: 'rgb(252, 252, 252)',
    borderRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommended: {
    color: '#0FC2C0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    color: 'rgb(1, 200, 214)',
    fontWeight: 'bold',
    marginRight: 15,
  },
  votes: {
    fontSize: 14,
    color: '#666',
  },
  cartControls: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cartButton: {
    padding: 5,
  },
  removeButton: {
    padding: 5,
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    width: width * 0.7,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedCategoryItem: {
    backgroundColor: '#f9f9f9',
  },
  categoryMenuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68, 128, 127, 0.06)', 
  },
  categoryIcon: {
    textAlign: 'center',
    color:'rgba(0, 0, 0, 0.84)',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgb(250, 250, 250)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(2, 185, 209)',
  },
  cartButtonSummary: {
    backgroundColor: '#0FC2C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
  
});

export default Dashboard;